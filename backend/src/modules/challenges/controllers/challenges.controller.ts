import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeDto, UpdateChallengeDto, ChallengeFilterDto, UpdateProgressDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('challenges')
@Controller('challenges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all challenges with filters' })
  @ApiResponse({ status: 200, description: 'Challenges retrieved successfully' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() filters: ChallengeFilterDto,
  ) {
    const result = await this.challengesService.findAll(user.sub, filters);
    return createSuccessResponse(result, 'Challenges retrieved successfully');
  }

  @Get('my')
  @ApiOperation({ summary: "Get user's challenges" })
  @ApiResponse({ status: 200, description: 'User challenges retrieved successfully' })
  async getMyProgress(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: 'active' | 'completed',
  ) {
    const challenges = await this.challengesService.getUserChallenges(user.sub, status);
    return createSuccessResponse(challenges, 'User challenges retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get challenge by ID' })
  @ApiResponse({ status: 200, description: 'Challenge retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') challengeId: string,
  ) {
    const challenge = await this.challengesService.findOne(user.sub, challengeId);
    return createSuccessResponse(challenge, 'Challenge retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new challenge (admin)' })
  @ApiResponse({ status: 201, description: 'Challenge created successfully' })
  async create(@Body() createChallengeDto: CreateChallengeDto) {
    const challenge = await this.challengesService.create(createChallengeDto);
    return createSuccessResponse(challenge, 'Challenge created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a challenge (admin)' })
  @ApiResponse({ status: 200, description: 'Challenge updated successfully' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async update(
    @Param('id') challengeId: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    const challenge = await this.challengesService.update(challengeId, updateChallengeDto);
    return createSuccessResponse(challenge, 'Challenge updated successfully');
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a challenge' })
  @ApiResponse({ status: 200, description: 'Joined challenge successfully' })
  @ApiResponse({ status: 400, description: 'Already participating or challenge not active' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async join(
    @CurrentUser() user: JwtPayload,
    @Param('id') challengeId: string,
  ) {
    const result = await this.challengesService.join(user.sub, challengeId);
    return createSuccessResponse(result, 'Joined challenge successfully');
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a challenge' })
  @ApiResponse({ status: 200, description: 'Left challenge successfully' })
  @ApiResponse({ status: 404, description: 'Not participating in this challenge' })
  async leave(
    @CurrentUser() user: JwtPayload,
    @Param('id') challengeId: string,
  ) {
    const result = await this.challengesService.leave(user.sub, challengeId);
    return createSuccessResponse(result, 'Left challenge successfully');
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Update progress in a challenge' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  @ApiResponse({ status: 400, description: 'Challenge has ended' })
  @ApiResponse({ status: 404, description: 'Not participating in this challenge' })
  async updateProgress(
    @CurrentUser() user: JwtPayload,
    @Param('id') challengeId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    const result = await this.challengesService.updateProgress(user.sub, challengeId, dto);
    return createSuccessResponse(result, 'Progress updated successfully');
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get challenge leaderboard' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async getLeaderboard(
    @Param('id') challengeId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.challengesService.getLeaderboard(
      challengeId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Leaderboard retrieved successfully');
  }
}
