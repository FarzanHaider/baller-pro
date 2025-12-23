import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReferralsService } from '../services/referrals.service';
import { CreateReferralDto, ApplyReferralCodeDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('code')
  @ApiOperation({ summary: "Get user's referral code" })
  @ApiResponse({ status: 200, description: 'Referral code retrieved successfully' })
  async getReferralCode(@CurrentUser() user: JwtPayload) {
    const result = await this.referralsService.getReferralCode(user.sub);
    return createSuccessResponse(result, 'Referral code retrieved successfully');
  }

  @Get()
  @ApiOperation({ summary: "Get user's referrals" })
  @ApiResponse({ status: 200, description: 'Referrals retrieved successfully' })
  async getReferrals(@CurrentUser() user: JwtPayload) {
    const result = await this.referralsService.getReferrals(user.sub);
    return createSuccessResponse(result, 'Referrals retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a referral (invite someone)' })
  @ApiResponse({ status: 201, description: 'Referral created successfully' })
  @ApiResponse({ status: 400, description: 'Email already referred or registered' })
  async createReferral(
    @CurrentUser() user: JwtPayload,
    @Body() createReferralDto: CreateReferralDto,
  ) {
    const referral = await this.referralsService.createReferral(user.sub, createReferralDto);
    return createSuccessResponse(referral, 'Referral created successfully');
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply a referral code' })
  @ApiResponse({ status: 200, description: 'Referral code applied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid referral code' })
  async applyReferralCode(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ApplyReferralCodeDto,
  ) {
    const result = await this.referralsService.applyReferralCode(user.sub, dto.code);
    return createSuccessResponse(result, 'Referral code applied successfully');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral stats' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats(@CurrentUser() user: JwtPayload) {
    const stats = await this.referralsService.getStats(user.sub);
    return createSuccessResponse(stats, 'Stats retrieved successfully');
  }
}
