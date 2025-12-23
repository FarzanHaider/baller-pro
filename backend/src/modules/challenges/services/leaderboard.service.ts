import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardFilterDto } from '../dto';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private prisma: PrismaService) {}

  // Get global leaderboard
  async getGlobalLeaderboard(userId: string, filters: LeaderboardFilterDto) {
    const { period = 'weekly', page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const { periodStart, periodEnd } = this.getPeriodDates(period);

    // Get leaderboard entries for the period
    const [entries, total] = await Promise.all([
      this.prisma.leaderboardEntry.findMany({
        where: {
          leaderboardType: `global_${period}`,
          periodStart,
        },
        orderBy: { score: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.leaderboardEntry.count({
        where: {
          leaderboardType: `global_${period}`,
          periodStart,
        },
      }),
    ]);

    // Get user details for entries
    const userIds = entries.map((e) => e.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Get current user's position
    const userEntry = await this.prisma.leaderboardEntry.findFirst({
      where: {
        userId,
        leaderboardType: `global_${period}`,
        periodStart,
      },
    });

    return {
      period: {
        type: period,
        start: periodStart.toISOString().split('T')[0],
        end: periodEnd.toISOString().split('T')[0],
      },
      items: entries.map((entry, index) => {
        const user = userMap.get(entry.userId);
        return {
          rank: skip + index + 1,
          user: user
            ? { id: user.id, name: user.name, avatar: user.avatarUrl }
            : { id: entry.userId, name: 'Unknown', avatar: null },
          score: entry.score,
          isCurrentUser: entry.userId === userId,
        };
      }),
      currentUser: userEntry ? {
        rank: userEntry.rank,
        score: userEntry.score,
      } : null,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get workout leaderboard (by total workouts completed)
  async getWorkoutLeaderboard(userId: string, filters: LeaderboardFilterDto) {
    const { period = 'weekly', page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const { periodStart, periodEnd } = this.getPeriodDates(period);

    // Aggregate workout sessions by user
    const workoutCounts = await this.prisma.workoutSession.groupBy({
      by: ['userId'],
      where: {
        completedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      skip,
      take: limit,
    });

    const totalUsers = await this.prisma.workoutSession.groupBy({
      by: ['userId'],
      where: {
        completedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    // Get user details
    const userIds = workoutCounts.map((w) => w.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Get current user's count
    const userCount = await this.prisma.workoutSession.count({
      where: {
        userId,
        completedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    // Calculate user's rank
    const usersAhead = await this.prisma.workoutSession.groupBy({
      by: ['userId'],
      where: {
        completedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gt: userCount,
          },
        },
      },
    });

    return {
      period: {
        type: period,
        start: periodStart.toISOString().split('T')[0],
        end: periodEnd.toISOString().split('T')[0],
      },
      items: workoutCounts.map((entry, index) => {
        const user = userMap.get(entry.userId);
        return {
          rank: skip + index + 1,
          user: user ? {
            id: user.id,
            name: user.name,
            avatar: user.avatarUrl,
          } : { id: entry.userId, name: 'Unknown', avatar: null },
          workouts: entry._count.id,
          isCurrentUser: entry.userId === userId,
        };
      }),
      currentUser: {
        rank: usersAhead.length + 1,
        workouts: userCount,
      },
      pagination: {
        page,
        limit,
        total: totalUsers.length,
        totalPages: Math.ceil(totalUsers.length / limit),
      },
    };
  }

  // Get streak leaderboard
  async getStreakLeaderboard(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Get habit streaks with user info
    const [streaks, total] = await Promise.all([
      this.prisma.habitStreak.findMany({
        where: {
          currentStreak: { gt: 0 },
        },
        include: {
          habit: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: { currentStreak: 'desc' },
      }),
      this.prisma.habitStreak.count({
        where: { currentStreak: { gt: 0 } },
      }),
    ]);

    // Aggregate max streak per user
    const userStreaks = new Map<string, number>();
    for (const streak of streaks) {
      const current = userStreaks.get(streak.habit.userId) || 0;
      if (streak.currentStreak > current) {
        userStreaks.set(streak.habit.userId, streak.currentStreak);
      }
    }

    // Sort and paginate
    const sortedEntries = Array.from(userStreaks.entries())
      .sort((a, b) => b[1] - a[1]);

    const paginatedEntries = sortedEntries.slice(skip, skip + limit);

    // Get user details
    const userIds = paginatedEntries.map(([id]) => id);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Get current user's streak
    const userMaxStreak = userStreaks.get(userId) || 0;
    const userRank = sortedEntries.findIndex(([id]) => id === userId) + 1;

    return {
      items: paginatedEntries.map(([id, streak], index) => {
        const user = userMap.get(id);
        return {
          rank: skip + index + 1,
          user: user ? {
            id: user.id,
            name: user.name,
            avatar: user.avatarUrl,
          } : { id, name: 'Unknown', avatar: null },
          streak,
          isCurrentUser: id === userId,
        };
      }),
      currentUser: {
        rank: userRank || null,
        streak: userMaxStreak,
      },
      pagination: {
        page,
        limit,
        total: sortedEntries.length,
        totalPages: Math.ceil(sortedEntries.length / limit),
      },
    };
  }

  // Calculate period dates
  private getPeriodDates(period: 'weekly' | 'monthly' | 'all_time'): { periodStart: Date; periodEnd: Date } {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date = new Date(now);
    periodEnd.setHours(23, 59, 59, 999);

    if (period === 'weekly') {
      // Start of current week (Monday)
      periodStart = new Date(now);
      const day = periodStart.getDay();
      const diff = periodStart.getDate() - day + (day === 0 ? -6 : 1);
      periodStart.setDate(diff);
      periodStart.setHours(0, 0, 0, 0);
    } else if (period === 'monthly') {
      // Start of current month
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodStart.setHours(0, 0, 0, 0);
    } else {
      // All time - use a very old date
      periodStart = new Date('2020-01-01');
      periodStart.setHours(0, 0, 0, 0);
    }

    return { periodStart, periodEnd };
  }

  // Scheduled job to update leaderboard entries
  async updateLeaderboards() {
    this.logger.log('Updating leaderboard entries...');

    const periods: ('weekly' | 'monthly')[] = ['weekly', 'monthly'];

    for (const period of periods) {
      const { periodStart, periodEnd } = this.getPeriodDates(period);

      // Get workout counts for all users
      const workoutCounts = await this.prisma.workoutSession.groupBy({
        by: ['userId'],
        where: {
          completedAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      // Upsert leaderboard entries
      for (let i = 0; i < workoutCounts.length; i++) {
        const entry = workoutCounts[i];
        await this.prisma.leaderboardEntry.upsert({
          where: {
            userId_leaderboardType_periodStart: {
              userId: entry.userId,
              leaderboardType: `global_${period}`,
              periodStart,
            },
          },
          update: {
            score: entry._count.id,
            rank: i + 1,
            periodEnd,
          },
          create: {
            userId: entry.userId,
            leaderboardType: `global_${period}`,
            periodStart,
            periodEnd,
            score: entry._count.id,
            rank: i + 1,
          },
        });
      }
    }

    this.logger.log('Leaderboard entries updated');
  }
}
