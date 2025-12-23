import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChallengeDto, UpdateChallengeDto, ChallengeFilterDto, UpdateProgressDto } from '../dto';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(private prisma: PrismaService) {}

  // Get all challenges with filters
  async findAll(userId: string, filters: ChallengeFilterDto) {
    const { status, type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const now = new Date();

    const where: any = {};

    // Filter by status
    if (status === 'active') {
      where.isActive = true;
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    } else if (status === 'upcoming') {
      where.isActive = true;
      where.startDate = { gt: now };
    } else if (status === 'completed') {
      where.endDate = { lt: now };
    } else {
      where.isActive = true;
    }

    if (type) {
      where.challengeType = type;
    }

    const [challenges, total] = await Promise.all([
      this.prisma.challenge.findMany({
        where,
        include: {
          _count: {
            select: { participants: true },
          },
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.challenge.count({ where }),
    ]);

    // Check if user is participating in each challenge
    const challengeIds = challenges.map((c) => c.id);
    const participations = await this.prisma.challengeParticipant.findMany({
      where: {
        userId,
        challengeId: { in: challengeIds },
      },
      select: { challengeId: true, currentValue: true, rank: true },
    });
    const participationMap = new Map(participations.map((p) => [p.challengeId, p]));

    return {
      items: challenges.map((c) => {
        const participation = participationMap.get(c.id);
        return this.formatChallenge(c, participation);
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single challenge with details
  async findOne(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const participation = await this.prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });

    // Get top 10 leaderboard
    const leaderboard = await this.prisma.challengeParticipant.findMany({
      where: { challengeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { currentValue: 'desc' },
      take: 10,
    });

    return {
      ...this.formatChallenge(challenge, participation),
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        user: {
          id: entry.user.id,
          name: entry.user.name,
          avatar: entry.user.avatarUrl,
        },
        value: entry.currentValue,
        isCurrentUser: entry.userId === userId,
      })),
    };
  }

  // Create a challenge (admin)
  async create(dto: CreateChallengeDto) {
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + dto.durationDays);

    const challenge = await this.prisma.challenge.create({
      data: {
        title: dto.title,
        description: dto.description,
        challengeType: dto.challengeType,
        targetValue: dto.targetValue,
        durationDays: dto.durationDays,
        startDate,
        endDate,
        imageUrl: dto.imageUrl,
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    this.logger.log(`Challenge created: ${challenge.id}`);

    return this.formatChallenge(challenge, null);
  }

  // Update a challenge (admin)
  async update(challengeId: string, dto: UpdateChallengeDto) {
    const existing = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!existing) {
      throw new NotFoundException('Challenge not found');
    }

    const challenge = await this.prisma.challenge.update({
      where: { id: challengeId },
      data: {
        title: dto.title,
        description: dto.description,
        targetValue: dto.targetValue,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive,
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    return this.formatChallenge(challenge, null);
  }

  // Join a challenge
  async join(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.isActive) {
      throw new BadRequestException('This challenge is not active');
    }

    const now = new Date();
    if (challenge.endDate && challenge.endDate < now) {
      throw new BadRequestException('This challenge has ended');
    }

    // Check if already participating
    const existing = await this.prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });

    if (existing) {
      throw new BadRequestException('Already participating in this challenge');
    }

    await this.prisma.challengeParticipant.create({
      data: {
        challengeId,
        userId,
        currentValue: 0,
      },
    });

    this.logger.log(`User ${userId} joined challenge ${challengeId}`);

    return { challengeId, joined: true };
  }

  // Leave a challenge
  async leave(userId: string, challengeId: string) {
    const participation = await this.prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });

    if (!participation) {
      throw new NotFoundException('Not participating in this challenge');
    }

    await this.prisma.challengeParticipant.delete({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });

    this.logger.log(`User ${userId} left challenge ${challengeId}`);

    return { challengeId, joined: false };
  }

  // Update progress in a challenge
  async updateProgress(userId: string, challengeId: string, dto: UpdateProgressDto) {
    const participation = await this.prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
      include: { challenge: true },
    });

    if (!participation) {
      throw new NotFoundException('Not participating in this challenge');
    }

    const challenge = participation.challenge;
    const now = new Date();

    if (challenge.endDate && challenge.endDate < now) {
      throw new BadRequestException('This challenge has ended');
    }

    const newValue = dto.value;
    let completedAt = participation.completedAt;

    // Check if target reached
    if (challenge.targetValue && newValue >= challenge.targetValue && !completedAt) {
      completedAt = now;
    }

    await this.prisma.challengeParticipant.update({
      where: {
        challengeId_userId: { challengeId, userId },
      },
      data: {
        currentValue: newValue,
        completedAt,
      },
    });

    // Update ranks
    await this.updateRanks(challengeId);

    this.logger.log(`User ${userId} updated progress to ${newValue} in challenge ${challengeId}`);

    return {
      challengeId,
      currentValue: newValue,
      completed: !!completedAt,
    };
  }

  // Get user's challenges
  async getUserChallenges(userId: string, status?: 'active' | 'completed') {
    const now = new Date();

    const where: any = {
      userId,
    };

    if (status === 'active') {
      where.challenge = {
        isActive: true,
        endDate: { gte: now },
      };
      where.completedAt = null;
    } else if (status === 'completed') {
      where.completedAt = { not: null };
    }

    const participations = await this.prisma.challengeParticipant.findMany({
      where,
      include: {
        challenge: {
          include: {
            _count: {
              select: { participants: true },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return participations.map((p) => ({
      ...this.formatChallenge(p.challenge, p),
      joinedAt: p.joinedAt.toISOString(),
    }));
  }

  // Get challenge leaderboard
  async getLeaderboard(challengeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const [entries, total] = await Promise.all([
      this.prisma.challengeParticipant.findMany({
        where: { challengeId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { currentValue: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.challengeParticipant.count({ where: { challengeId } }),
    ]);

    return {
      challenge: {
        id: challenge.id,
        title: challenge.title,
        targetValue: challenge.targetValue,
      },
      items: entries.map((entry, index) => ({
        rank: skip + index + 1,
        user: {
          id: entry.user.id,
          name: entry.user.name,
          avatar: entry.user.avatarUrl,
        },
        value: entry.currentValue,
        completed: !!entry.completedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update ranks for a challenge
  private async updateRanks(challengeId: string) {
    const participants = await this.prisma.challengeParticipant.findMany({
      where: { challengeId },
      orderBy: { currentValue: 'desc' },
    });

    // Update ranks in batches
    for (let i = 0; i < participants.length; i++) {
      await this.prisma.challengeParticipant.update({
        where: { id: participants[i].id },
        data: { rank: i + 1 },
      });
    }
  }

  private formatChallenge(challenge: any, participation: any) {
    const now = new Date();
    const isActive = challenge.isActive &&
      (!challenge.startDate || challenge.startDate <= now) &&
      (!challenge.endDate || challenge.endDate >= now);

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      type: challenge.challengeType,
      targetValue: challenge.targetValue,
      durationDays: challenge.durationDays,
      startDate: challenge.startDate?.toISOString().split('T')[0],
      endDate: challenge.endDate?.toISOString().split('T')[0],
      image: challenge.imageUrl,
      participantCount: challenge._count?.participants || 0,
      isActive,
      isJoined: !!participation,
      progress: participation ? {
        currentValue: participation.currentValue,
        rank: participation.rank,
        completed: !!participation.completedAt,
        percentage: challenge.targetValue
          ? Math.min(100, Math.round((participation.currentValue / challenge.targetValue) * 100))
          : null,
      } : null,
    };
  }
}
