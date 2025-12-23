import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, FeedFilterDto } from '../dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private prisma: PrismaService) {}

  // Get feed with optional filtering
  async getFeed(userId: string, filters: FeedFilterDto) {
    const { filter, type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    // Filter by following only
    if (filter === 'following') {
      const following = await this.prisma.userFollow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = following.map((f) => f.followingId);
      followingIds.push(userId); // Include own posts
      where.authorId = { in: followingIds };
    }

    if (type) {
      where.workoutType = type;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    // Check if current user liked each post
    const postIds = posts.map((p) => p.id);
    const userLikes = await this.prisma.postLike.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    return {
      items: posts.map((post) => this.formatPost(post, likedPostIds.has(post.id))),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Create a new post
  async create(userId: string, dto: CreatePostDto) {
    const data: any = {
      authorId: userId,
      content: dto.content || '',
      workoutType: dto.type,
      imageUrl: dto.images?.[0],
    };

    if (dto.achievementData) {
      data.workoutDetails = dto.achievementData;
    }

    const post = await this.prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    this.logger.log(`User ${userId} created post ${post.id}`);

    return this.formatPost(post, false);
  }

  // Get single post
  async findOne(userId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, isActive: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isLiked = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    return this.formatPost(post, !!isLiked);
  }

  // Update a post
  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const existing = await this.prisma.post.findFirst({
      where: { id: postId, authorId: userId, isActive: true },
    });

    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    const post = await this.prisma.post.update({
      where: { id: postId },
      data: {
        content: dto.content,
        imageUrl: dto.images?.[0],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return this.formatPost(post, false);
  }

  // Delete a post (soft delete)
  async remove(userId: string, postId: string) {
    const existing = await this.prisma.post.findFirst({
      where: { id: postId, authorId: userId, isActive: true },
    });

    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { isActive: false },
    });

    this.logger.log(`User ${userId} deleted post ${postId}`);
  }

  // Like/unlike a post
  async toggleLike(userId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existing = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    let isLiked: boolean;

    if (existing) {
      await this.prisma.postLike.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });
      // Decrement likes count
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      isLiked = false;
    } else {
      await this.prisma.postLike.create({
        data: { userId, postId },
      });
      // Increment likes count
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      isLiked = true;
    }

    const likeCount = await this.prisma.postLike.count({
      where: { postId },
    });

    return { postId, isLiked, likeCount };
  }

  // Get users who liked a post
  async getLikes(postId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.prisma.postLike.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.postLike.count({ where: { postId } }),
    ]);

    return {
      items: likes.map((l) => ({
        userId: l.user.id,
        name: l.user.name,
        avatar: l.user.avatarUrl,
        likedAt: l.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get user's posts
  async getUserPosts(userId: string, targetUserId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: targetUserId, isActive: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where: { authorId: targetUserId, isActive: true } }),
    ]);

    // Check if current user liked each post
    const postIds = posts.map((p) => p.id);
    const userLikes = await this.prisma.postLike.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    return {
      items: posts.map((post) => this.formatPost(post, likedPostIds.has(post.id))),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private formatPost(post: any, isLiked: boolean) {
    const result: any = {
      id: post.id,
      type: post.workoutType || 'general',
      content: post.content,
      images: post.imageUrl ? [post.imageUrl] : [],
      user: {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatarUrl,
      },
      likeCount: post._count?.likes || post.likesCount || 0,
      commentCount: post._count?.comments || post.commentsCount || 0,
      isLiked,
      createdAt: post.createdAt.toISOString(),
    };

    if (post.workoutDetails) {
      result.workout = post.workoutDetails;
    }

    return result;
  }
}
