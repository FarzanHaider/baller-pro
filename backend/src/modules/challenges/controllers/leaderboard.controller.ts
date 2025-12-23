import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LeaderboardService } from '../services/leaderboard.service';
import { LeaderboardFilterDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  async getGlobalLeaderboard(
    @CurrentUser() user: JwtPayload,
    @Query() filters: LeaderboardFilterDto,
  ) {
    const result = await this.leaderboardService.getGlobalLeaderboard(user.sub, filters);
    return createSuccessResponse(result, 'Leaderboard retrieved successfully');
  }

  @Get('workouts')
  @ApiOperation({ summary: 'Get workout leaderboard' })
  @ApiResponse({ status: 200, description: 'Workout leaderboard retrieved successfully' })
  async getWorkoutLeaderboard(
    @CurrentUser() user: JwtPayload,
    @Query() filters: LeaderboardFilterDto,
  ) {
    const result = await this.leaderboardService.getWorkoutLeaderboard(user.sub, filters);
    return createSuccessResponse(result, 'Workout leaderboard retrieved successfully');
  }

  @Get('streaks')
  @ApiOperation({ summary: 'Get streak leaderboard' })
  @ApiResponse({ status: 200, description: 'Streak leaderboard retrieved successfully' })
  async getStreakLeaderboard(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.leaderboardService.getStreakLeaderboard(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Streak leaderboard retrieved successfully');
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly leaderboard (shortcut)' })
  @ApiResponse({ status: 200, description: 'Weekly leaderboard retrieved successfully' })
  async getWeeklyLeaderboard(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.leaderboardService.getWorkoutLeaderboard(user.sub, {
      period: 'weekly',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    return createSuccessResponse(result, 'Weekly leaderboard retrieved successfully');
  }
}
