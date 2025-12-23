import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubscriptionsService } from '../services/subscriptions.service';
import { CreatePlanDto, ValidateReceiptDto, RevenueCatWebhookDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @Public()
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async getPlans() {
    const plans = await this.subscriptionsService.getPlans();
    return createSuccessResponse(plans, 'Plans retrieved successfully');
  }

  @Get('plans/:id')
  @Public()
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async getPlan(@Param('id') planId: string) {
    const plan = await this.subscriptionsService.getPlan(planId);
    return createSuccessResponse(plan, 'Plan retrieved successfully');
  }

  @Post('plans')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a subscription plan (admin)' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    const plan = await this.subscriptionsService.createPlan(createPlanDto);
    return createSuccessResponse(plan, 'Plan created successfully');
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's current subscription" })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully' })
  async getCurrentSubscription(@CurrentUser() user: JwtPayload) {
    const result = await this.subscriptionsService.getCurrentSubscription(user.sub);
    return createSuccessResponse(result, 'Subscription retrieved successfully');
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate receipt and activate subscription' })
  @ApiResponse({ status: 200, description: 'Receipt validated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid receipt' })
  async validateReceipt(
    @CurrentUser() user: JwtPayload,
    @Body() validateReceiptDto: ValidateReceiptDto,
  ) {
    const result = await this.subscriptionsService.validateReceipt(user.sub, validateReceiptDto);
    return createSuccessResponse(result, 'Receipt validated successfully');
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user has premium' })
  @ApiResponse({ status: 200, description: 'Premium status checked' })
  async checkPremium(@CurrentUser() user: JwtPayload) {
    const isPremium = await this.subscriptionsService.checkPremium(user.sub);
    return createSuccessResponse({ isPremium }, 'Premium status checked');
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(@CurrentUser() user: JwtPayload) {
    const history = await this.subscriptionsService.getHistory(user.sub);
    return createSuccessResponse(history, 'History retrieved successfully');
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'RevenueCat webhook handler' })
  @ApiResponse({ status: 200, description: 'Webhook received' })
  async handleWebhook(@Body() webhookDto: RevenueCatWebhookDto) {
    const result = await this.subscriptionsService.handleWebhook(webhookDto);
    return result;
  }
}
