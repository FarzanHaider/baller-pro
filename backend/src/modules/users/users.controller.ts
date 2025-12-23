import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService, UserResponse, OnboardingResponse } from './users.service';
import { UpdateProfileDto, OnboardingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import {
  createSuccessResponse,
  ApiResponseDto,
} from '../../common/dto/api-response.dto';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@CurrentUser() user: JwtPayload): Promise<ApiResponseDto<UserResponse>> {
    const profile = await this.usersService.getProfile(user.sub);
    return createSuccessResponse(profile, 'Profile retrieved successfully');
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponseDto<UserResponse>> {
    const profile = await this.usersService.updateProfile(user.sub, updateProfileDto);
    return createSuccessResponse(profile, 'Profile updated successfully');
  }

  @Get('onboarding')
  @ApiOperation({ summary: 'Get onboarding data' })
  @ApiResponse({ status: 200, description: 'Onboarding data retrieved' })
  async getOnboarding(
    @CurrentUser() user: JwtPayload,
  ): Promise<ApiResponseDto<OnboardingResponse | null>> {
    const onboarding = await this.usersService.getOnboarding(user.sub);
    return createSuccessResponse(onboarding, 'Onboarding data retrieved');
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Save onboarding data' })
  @ApiResponse({ status: 200, description: 'Onboarding data saved' })
  async saveOnboarding(
    @CurrentUser() user: JwtPayload,
    @Body() onboardingDto: OnboardingDto,
  ): Promise<ApiResponseDto<OnboardingResponse>> {
    const onboarding = await this.usersService.saveOnboarding(user.sub, onboardingDto);
    return createSuccessResponse(onboarding, 'Onboarding data saved successfully');
  }
}
