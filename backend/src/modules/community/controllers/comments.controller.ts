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
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('community')
@Controller('community/posts/:postId/comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getPostComments(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.commentsService.getPostComments(
      user.sub,
      postId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Comments retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.create(user.sub, postId, createCommentDto);
    return createSuccessResponse(comment, 'Comment added successfully');
  }

  @Get(':commentId/replies')
  @ApiOperation({ summary: 'Get replies for a comment' })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.commentsService.getReplies(
      commentId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Replies retrieved successfully');
  }

  @Put(':commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.update(user.sub, commentId, updateCommentDto);
    return createSuccessResponse(comment, 'Comment updated successfully');
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('commentId') commentId: string,
  ) {
    await this.commentsService.remove(user.sub, commentId);
    return createSuccessResponse(null, 'Comment deleted successfully');
  }
}
