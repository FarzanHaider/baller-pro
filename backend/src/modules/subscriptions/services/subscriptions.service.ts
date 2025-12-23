import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto, ValidateReceiptDto, SubscriptionProvider } from '../dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // Get all subscription plans
  async getPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceCents: 'asc' },
    });

    return plans.map((plan) => this.formatPlan(plan));
  }

  // Get single plan
  async getPlan(planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return this.formatPlan(plan);
  }

  // Create a plan (admin)
  async createPlan(dto: CreatePlanDto) {
    const plan = await this.prisma.subscriptionPlan.create({
      data: {
        name: dto.name,
        priceCents: dto.priceCents,
        currency: dto.currency || 'USD',
        interval: dto.interval,
        stripePriceId: dto.stripePriceId,
        appleProductId: dto.appleProductId,
        googleProductId: dto.googleProductId,
        features: dto.features || [],
      },
    });

    return this.formatPlan(plan);
  }

  // Get user's current subscription
  async getCurrentSubscription(userId: string) {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trial'] },
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return {
        isPremium: false,
        subscription: null,
      };
    }

    return {
      isPremium: true,
      subscription: this.formatSubscription(subscription),
    };
  }

  // Validate receipt and create/update subscription
  async validateReceipt(userId: string, dto: ValidateReceiptDto) {
    // In production, this would call RevenueCat API to validate the receipt
    // For now, we'll simulate the validation
    this.logger.log(`Validating ${dto.provider} receipt for user ${userId}`);

    // Mock validation - in production, call RevenueCat
    const isValid = true;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    if (!isValid) {
      throw new BadRequestException('Invalid receipt');
    }

    // Find or create subscription
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: {
        OR: [
          { appleProductId: dto.productId },
          { googleProductId: dto.productId },
        ],
        isActive: true,
      },
    });

    if (!plan) {
      // Use default monthly plan
      const defaultPlan = await this.prisma.subscriptionPlan.findFirst({
        where: { interval: 'month', isActive: true },
      });

      if (!defaultPlan) {
        throw new BadRequestException('No subscription plan found');
      }
    }

    const subscription = await this.prisma.userSubscription.upsert({
      where: {
        id: await this.getExistingSubscriptionId(userId),
      },
      update: {
        status: 'active',
        provider: dto.provider,
        currentPeriodStart: new Date(),
        currentPeriodEnd: expiresAt,
      },
      create: {
        userId,
        planId: plan?.id || '',
        status: 'active',
        provider: dto.provider,
        currentPeriodStart: new Date(),
        currentPeriodEnd: expiresAt,
      },
      include: { plan: true },
    });

    // Update user's premium status
    await this.prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });

    this.logger.log(`Subscription validated for user ${userId}`);

    return {
      valid: true,
      subscription: this.formatSubscription(subscription),
    };
  }

  // Handle RevenueCat webhook
  async handleWebhook(payload: any) {
    const { type, event } = payload;

    this.logger.log(`RevenueCat webhook: ${type}`);

    const userId = event?.app_user_id;
    if (!userId) {
      this.logger.warn('Webhook missing app_user_id');
      return { received: true };
    }

    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await this.activateSubscription(userId, event);
        break;

      case 'CANCELLATION':
        await this.cancelSubscription(userId, event);
        break;

      case 'EXPIRATION':
        await this.expireSubscription(userId, event);
        break;

      case 'BILLING_ISSUE':
        await this.handleBillingIssue(userId, event);
        break;

      default:
        this.logger.log(`Unhandled webhook type: ${type}`);
    }

    return { received: true };
  }

  // Check if user has premium
  async checkPremium(userId: string): Promise<boolean> {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trial'] },
        currentPeriodEnd: { gte: new Date() },
      },
    });

    return !!subscription;
  }

  // Get subscription history
  async getHistory(userId: string) {
    const subscriptions = await this.prisma.userSubscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map((sub) => this.formatSubscription(sub));
  }

  private async getExistingSubscriptionId(userId: string): Promise<string> {
    const existing = await this.prisma.userSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return existing?.id || 'new-subscription';
  }

  private async activateSubscription(userId: string, event: any) {
    const expiresAt = event.expiration_at_ms
      ? new Date(event.expiration_at_ms)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.prisma.userSubscription.updateMany({
      where: { userId },
      data: {
        status: 'active',
        currentPeriodEnd: expiresAt,
        cancelAtPeriodEnd: false,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });

    this.logger.log(`Subscription activated for user ${userId}`);
  }

  private async cancelSubscription(userId: string, event: any) {
    await this.prisma.userSubscription.updateMany({
      where: { userId, status: 'active' },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    this.logger.log(`Subscription cancelled for user ${userId}`);
  }

  private async expireSubscription(userId: string, event: any) {
    await this.prisma.userSubscription.updateMany({
      where: { userId },
      data: {
        status: 'expired',
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { isPremium: false },
    });

    this.logger.log(`Subscription expired for user ${userId}`);
  }

  private async handleBillingIssue(userId: string, event: any) {
    this.logger.warn(`Billing issue for user ${userId}`);
    // Could send notification to user
  }

  private formatPlan(plan: any) {
    return {
      id: plan.id,
      name: plan.name,
      price: plan.priceCents / 100,
      priceCents: plan.priceCents,
      currency: plan.currency,
      interval: plan.interval,
      features: plan.features || [],
      appleProductId: plan.appleProductId,
      googleProductId: plan.googleProductId,
    };
  }

  private formatSubscription(subscription: any) {
    return {
      id: subscription.id,
      status: subscription.status,
      provider: subscription.provider,
      plan: subscription.plan ? this.formatPlan(subscription.plan) : null,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      trialEnd: subscription.trialEnd?.toISOString(),
      createdAt: subscription.createdAt.toISOString(),
    };
  }
}
