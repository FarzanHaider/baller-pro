import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSearchDto } from '../dto';

@Injectable()
export class FollowsService {
  private readonly logger = new Logger(FollowsService.name);

  constructor(private prisma: PrismaService) {}

  // Follow/unfollow a user
  async toggleFollow(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Verify target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: { followerId: userId, followingId: targetUserId },
      },
    });

    let isFollowing: boolean;

    if (existing) {
      await this.prisma.userFollow.delete({
        where: {
          followerId_followingId: { followerId: userId, followingId: targetUserId },
        },
      });
      isFollowing = false;
    } else {
      await this.prisma.userFollow.create({
        data: {
          followerId: userId,
          followingId: targetUserId,
        },
      });
      isFollowing = true;
    }

    this.logger.log(
      `User ${userId} ${isFollowing ? 'followed' : 'unfollowed'} user ${targetUserId}`,
    );

    return { userId: targetUserId, isFollowing };
  }

  // Check if following a user
  async checkFollow(userId: string, targetUserId: string) {
    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: { followerId: userId, followingId: targetUserId },
      },
    });

    return { userId: targetUserId, isFollowing: !!follow };
  }

  // Check multiple follow statuses
  async checkFollows(userId: string, targetUserIds: string[]) {
    const follows = await this.prisma.userFollow.findMany({
      where: {
        followerId: userId,
        followingId: { in: targetUserIds },
      },
      select: { followingId: true },
    });

    const followingSet = new Set(follows.map((f) => f.followingId));

    return targetUserIds.map((id) => ({
      userId: id,
      isFollowing: followingSet.has(id),
    }));
  }

  // Get user's followers
  async getFollowers(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      this.prisma.userFollow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
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
      this.prisma.userFollow.count({ where: { followingId: userId } }),
    ]);

    return {
      items: followers.map((f) => ({
        id: f.follower.id,
        name: f.follower.name,
        avatar: f.follower.avatarUrl,
        followedAt: f.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get users that a user is following
  async getFollowing(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      this.prisma.userFollow.findMany({
        where: { followerId: userId },
        include: {
          following: {
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
      this.prisma.userFollow.count({ where: { followerId: userId } }),
    ]);

    return {
      items: following.map((f) => ({
        id: f.following.id,
        name: f.following.name,
        avatar: f.following.avatarUrl,
        followedAt: f.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get follower/following counts
  async getCounts(userId: string) {
    const [followers, following] = await Promise.all([
      this.prisma.userFollow.count({ where: { followingId: userId } }),
      this.prisma.userFollow.count({ where: { followerId: userId } }),
    ]);

    return { followers, following };
  }

  // Search users
  async searchUsers(currentUserId: string, dto: UserSearchDto) {
    const { query, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
          id: { not: currentUserId },
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
          id: { not: currentUserId },
        },
      }),
    ]);

    // Check follow status for all users
    const userIds = users.map((u) => u.id);
    const follows = await this.prisma.userFollow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: userIds },
      },
      select: { followingId: true },
    });
    const followingSet = new Set(follows.map((f) => f.followingId));

    return {
      items: users.map((u) => ({
        id: u.id,
        name: u.name,
        avatar: u.avatarUrl,
        isFollowing: followingSet.has(u.id),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get user profile (public info)
  async getUserProfile(currentUserId: string, targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [counts, isFollowing, postCount] = await Promise.all([
      this.getCounts(targetUserId),
      this.prisma.userFollow.findUnique({
        where: {
          followerId_followingId: { followerId: currentUserId, followingId: targetUserId },
        },
      }),
      this.prisma.post.count({
        where: { authorId: targetUserId, isActive: true },
      }),
    ]);

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatarUrl,
      followers: counts.followers,
      following: counts.following,
      postCount,
      isFollowing: !!isFollowing,
      isOwnProfile: currentUserId === targetUserId,
      joinedAt: user.createdAt.toISOString(),
    };
  }
}
