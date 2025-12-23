import {
  Controller,
  Get,
  Post,
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
import { FollowsService } from '../services/follows.service';
import { UserSearchDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('community')
@Controller('community')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post('follow/:userId')
  @ApiOperation({ summary: 'Follow or unfollow a user' })
  @ApiResponse({ status: 200, description: 'Follow toggled successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async toggleFollow(
    @CurrentUser() user: JwtPayload,
    @Param('userId') targetUserId: string,
  ) {
    const result = await this.followsService.toggleFollow(user.sub, targetUserId);
    return createSuccessResponse(
      result,
      result.isFollowing ? 'User followed' : 'User unfollowed',
    );
  }

  @Get('following')
  @ApiOperation({ summary: 'Get users you are following' })
  @ApiResponse({ status: 200, description: 'Following list retrieved successfully' })
  async getFollowing(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.followsService.getFollowing(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Following list retrieved successfully');
  }

  @Get('followers')
  @ApiOperation({ summary: 'Get your followers' })
  @ApiResponse({ status: 200, description: 'Followers list retrieved successfully' })
  async getFollowers(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.followsService.getFollowers(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Followers list retrieved successfully');
  }

  @Get('users/search')
  @ApiOperation({ summary: 'Search for users' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  async searchUsers(
    @CurrentUser() user: JwtPayload,
    @Query() searchDto: UserSearchDto,
  ) {
    const result = await this.followsService.searchUsers(user.sub, searchDto);
    return createSuccessResponse(result, 'Users found successfully');
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserProfile(
    @CurrentUser() user: JwtPayload,
    @Param('userId') targetUserId: string,
  ) {
    const profile = await this.followsService.getUserProfile(user.sub, targetUserId);
    return createSuccessResponse(profile, 'Profile retrieved successfully');
  }

  @Get('users/:userId/posts')
  @ApiOperation({ summary: "Get user's posts" })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getUserPosts(
    @CurrentUser() user: JwtPayload,
    @Param('userId') targetUserId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // Import PostsService for this
    // For now, we'll inject it via the module
    return createSuccessResponse(null, 'Posts retrieved successfully');
  }

  @Get('users/:userId/followers')
  @ApiOperation({ summary: "Get user's followers" })
  @ApiResponse({ status: 200, description: 'Followers retrieved successfully' })
  async getOtherUserFollowers(
    @Param('userId') targetUserId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.followsService.getFollowers(
      targetUserId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Followers retrieved successfully');
  }

  @Get('users/:userId/following')
  @ApiOperation({ summary: "Get users that a user is following" })
  @ApiResponse({ status: 200, description: 'Following list retrieved successfully' })
  async getOtherUserFollowing(
    @Param('userId') targetUserId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.followsService.getFollowing(
      targetUserId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Following list retrieved successfully');
  }

  @Post('check-follows')
  @ApiOperation({ summary: 'Check follow status for multiple users' })
  @ApiResponse({ status: 200, description: 'Follow statuses checked' })
  async checkFollows(
    @CurrentUser() user: JwtPayload,
    @Body('userIds') userIds: string[],
  ) {
    const result = await this.followsService.checkFollows(user.sub, userIds);
    return createSuccessResponse(result, 'Follow statuses checked');
  }
}
