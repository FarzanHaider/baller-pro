import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReferralDto } from '../dto';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(private prisma: PrismaService) {}

  // Get user's referral code
  async getReferralCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, referralCode: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate referral code if not exists
    if (!user.referralCode) {
      const code = await this.generateUniqueCode(user.name);
      await this.prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      return { code };
    }

    return { code: user.referralCode };
  }

  // Create a referral (invite someone)
  async createReferral(userId: string, dto: CreateReferralDto) {
    // Check if email is already referred
    const existing = await this.prisma.referral.findFirst({
      where: {
        referrerId: userId,
        referredEmail: dto.referredEmail.toLowerCase(),
      },
    });

    if (existing) {
      throw new BadRequestException('This email has already been referred');
    }

    // Check if email belongs to existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.referredEmail.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('This user is already registered');
    }

    const referral = await this.prisma.referral.create({
      data: {
        referrerId: userId,
        referredEmail: dto.referredEmail.toLowerCase(),
        status: 'Pending',
      },
    });

    this.logger.log(`User ${userId} created referral for ${dto.referredEmail}`);

    return {
      id: referral.id,
      email: referral.referredEmail,
      status: referral.status,
      createdAt: referral.createdAt.toISOString(),
    };
  }

  // Get user's referrals
  async getReferrals(userId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get stats
    const stats = {
      total: referrals.length,
      pending: referrals.filter((r) => r.status === 'Pending').length,
      confirmed: referrals.filter((r) => r.status === 'Confirmed').length,
      rewarded: referrals.filter((r) => r.status === 'Rewarded').length,
    };

    return {
      referrals: referrals.map((r) => ({
        id: r.id,
        email: r.referredEmail,
        status: r.status,
        referredUser: r.referredUser
          ? {
              id: r.referredUser.id,
              name: r.referredUser.name,
              avatar: r.referredUser.avatarUrl,
            }
          : null,
        rewardType: r.rewardType,
        rewardAppliedAt: r.rewardAppliedAt?.toISOString(),
        createdAt: r.createdAt.toISOString(),
        confirmedAt: r.confirmedAt?.toISOString(),
      })),
      stats,
    };
  }

  // Apply referral code during registration
  async applyReferralCode(userId: string, referralCode: string) {
    // Find referrer by code
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      throw new BadRequestException('Invalid referral code');
    }

    if (referrer.id === userId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    // Get the new user's email
    const newUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!newUser) {
      throw new NotFoundException('User not found');
    }

    // Find or create referral
    let referral = await this.prisma.referral.findFirst({
      where: {
        referrerId: referrer.id,
        referredEmail: newUser.email,
      },
    });

    if (referral) {
      // Update existing referral
      referral = await this.prisma.referral.update({
        where: { id: referral.id },
        data: {
          referredUserId: userId,
          status: 'Confirmed',
          confirmedAt: new Date(),
        },
      });
    } else {
      // Create new referral
      referral = await this.prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredEmail: newUser.email,
          referredUserId: userId,
          status: 'Confirmed',
          confirmedAt: new Date(),
        },
      });
    }

    // Update new user's referredBy field
    await this.prisma.user.update({
      where: { id: userId },
      data: { referredById: referrer.id },
    });

    this.logger.log(`User ${userId} applied referral code from user ${referrer.id}`);

    return {
      success: true,
      referrer: {
        id: referrer.id,
        name: referrer.name,
      },
    };
  }

  // Check and apply rewards (called after successful subscription)
  async processReward(referralId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
    });

    if (!referral || referral.status !== 'Confirmed') {
      return null;
    }

    // Mark as rewarded
    await this.prisma.referral.update({
      where: { id: referralId },
      data: {
        status: 'Rewarded',
        rewardAppliedAt: new Date(),
      },
    });

    // Apply reward to referrer (e.g., extend subscription)
    // This would integrate with subscription service
    this.logger.log(`Reward processed for referral ${referralId}`);

    return { rewarded: true };
  }

  // Get referral stats
  async getStats(userId: string) {
    const [total, confirmed, rewarded] = await Promise.all([
      this.prisma.referral.count({ where: { referrerId: userId } }),
      this.prisma.referral.count({ where: { referrerId: userId, status: 'Confirmed' } }),
      this.prisma.referral.count({ where: { referrerId: userId, status: 'Rewarded' } }),
    ]);

    return {
      totalReferrals: total,
      confirmedReferrals: confirmed,
      rewardsEarned: rewarded,
    };
  }

  private async generateUniqueCode(name: string): Promise<string> {
    const baseName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${baseName}${randomPart}`;

    // Ensure uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { referralCode: code },
    });

    if (existing) {
      return this.generateUniqueCode(name);
    }

    return code;
  }
}
