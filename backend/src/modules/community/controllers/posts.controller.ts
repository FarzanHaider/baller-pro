import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { PostsService } from '../services/posts.service';
import { CreatePostDto, UpdatePostDto, FeedFilterDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('community')
@Controller('community/posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get feed with optional filters' })
  @ApiResponse({ status: 200, description: 'Feed retrieved successfully' })
  async getFeed(
    @CurrentUser() user: JwtPayload,
    @Query() filters: FeedFilterDto,
  ) {
    const result = await this.postsService.getFeed(user.sub, filters);
    return createSuccessResponse(result, 'Feed retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postsService.create(user.sub, createPostDto);
    return createSuccessResponse(post, 'Post created successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') postId: string,
  ) {
    const post = await this.postsService.findOne(user.sub, postId);
    return createSuccessResponse(post, 'Post retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.update(user.sub, postId, updatePostDto);
    return createSuccessResponse(post, 'Post updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') postId: string,
  ) {
    await this.postsService.remove(user.sub, postId);
    return createSuccessResponse(null, 'Post deleted successfully');
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like or unlike a post' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async toggleLike(
    @CurrentUser() user: JwtPayload,
    @Param('id') postId: string,
  ) {
    const result = await this.postsService.toggleLike(user.sub, postId);
    return createSuccessResponse(
      result,
      result.isLiked ? 'Post liked' : 'Post unliked',
    );
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Get users who liked a post' })
  @ApiResponse({ status: 200, description: 'Likes retrieved successfully' })
  async getLikes(
    @Param('id') postId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.postsService.getLikes(
      postId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Likes retrieved successfully');
  }
}
