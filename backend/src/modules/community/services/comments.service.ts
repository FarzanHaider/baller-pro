import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from '../dto';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(private prisma: PrismaService) {}

  // Get comments for a post
  async getPostComments(userId: string, postId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Verify post exists
    const post = await this.prisma.post.findFirst({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Get top-level comments
    const [comments, total] = await Promise.all([
      this.prisma.postComment.findMany({
        where: {
          postId,
          parentId: null,
          isActive: true,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          replies: {
            where: { isActive: true },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
            take: 3, // Show first 3 replies
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.postComment.count({
        where: { postId, parentId: null, isActive: true },
      }),
    ]);

    return {
      items: comments.map((c) => this.formatComment(c, userId)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get replies for a comment
  async getReplies(commentId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [replies, total] = await Promise.all([
      this.prisma.postComment.findMany({
        where: {
          parentId: commentId,
          isActive: true,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.postComment.count({
        where: { parentId: commentId, isActive: true },
      }),
    ]);

    return {
      items: replies.map((r) => ({
        id: r.id,
        content: r.content,
        user: {
          id: r.author.id,
          name: r.author.name,
          avatar: r.author.avatarUrl,
        },
        createdAt: r.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Create a comment
  async create(userId: string, postId: string, dto: CreateCommentDto) {
    // Verify post exists
    const post = await this.prisma.post.findFirst({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If replying to a comment, verify parent exists
    if (dto.parentId) {
      const parent = await this.prisma.postComment.findFirst({
        where: { id: dto.parentId, postId, isActive: true },
      });

      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.prisma.postComment.create({
      data: {
        authorId: userId,
        postId,
        parentId: dto.parentId,
        content: dto.content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Increment comment count on post
    await this.prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    this.logger.log(`User ${userId} commented on post ${postId}`);

    return {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.author.id,
        name: comment.author.name,
        avatar: comment.author.avatarUrl,
      },
      parentId: comment.parentId,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  // Update a comment
  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const existing = await this.prisma.postComment.findFirst({
      where: { id: commentId, authorId: userId, isActive: true },
    });

    if (!existing) {
      throw new NotFoundException('Comment not found');
    }

    const comment = await this.prisma.postComment.update({
      where: { id: commentId },
      data: { content: dto.content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.author.id,
        name: comment.author.name,
        avatar: comment.author.avatarUrl,
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }

  // Delete a comment (soft delete)
  async remove(userId: string, commentId: string) {
    const existing = await this.prisma.postComment.findFirst({
      where: { id: commentId, authorId: userId, isActive: true },
    });

    if (!existing) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.postComment.update({
      where: { id: commentId },
      data: { isActive: false },
    });

    // Decrement comment count on post
    await this.prisma.post.update({
      where: { id: existing.postId },
      data: { commentsCount: { decrement: 1 } },
    });

    this.logger.log(`User ${userId} deleted comment ${commentId}`);
  }

  private formatComment(comment: any, currentUserId: string) {
    return {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.author.id,
        name: comment.author.name,
        avatar: comment.author.avatarUrl,
      },
      isOwn: comment.authorId === currentUserId,
      replyCount: comment._count?.replies || 0,
      replies: comment.replies?.map((r: any) => ({
        id: r.id,
        content: r.content,
        user: {
          id: r.author.id,
          name: r.author.name,
          avatar: r.author.avatarUrl,
        },
        createdAt: r.createdAt.toISOString(),
      })) || [],
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
