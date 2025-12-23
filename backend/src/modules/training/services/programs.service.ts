import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProgramDto,
  UpdateProgramDto,
  ProgramFilterDto,
  EnrollProgramDto,
} from '../dto';

@Injectable()
export class ProgramsService {
  private readonly logger = new Logger(ProgramsService.name);

  constructor(private prisma: PrismaService) {}

  // List programs with filters
  async findAll(filters: ProgramFilterDto) {
    const { difficulty, category, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [programs, total] = await Promise.all([
      this.prisma.program.findMany({
        where,
        include: {
          _count: {
            select: { weeks: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.program.count({ where }),
    ]);

    return {
      items: programs.map((p) => this.formatProgram(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get program by ID with weeks and workouts
  async findOne(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        weeks: {
          include: {
            workouts: {
              include: {
                workout: {
                  include: {
                    category: true,
                  },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { weekNumber: 'asc' },
        },
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return this.formatProgramDetail(program);
  }

  // Create program (admin)
  async create(createProgramDto: CreateProgramDto) {
    const program = await this.prisma.program.create({
      data: {
        title: createProgramDto.title,
        description: createProgramDto.description,
        durationWeeks: createProgramDto.durationWeeks,
        difficulty: createProgramDto.difficulty,
        category: createProgramDto.category,
        imageUrl: createProgramDto.imageUrl,
        isPremium: createProgramDto.isPremium || false,
      },
    });

    return this.formatProgram(program);
  }

  // Update program (admin)
  async update(id: string, updateProgramDto: UpdateProgramDto) {
    const program = await this.prisma.program.update({
      where: { id },
      data: updateProgramDto,
    });

    return this.formatProgram(program);
  }

  // Delete program (admin) - soft delete
  async remove(id: string) {
    await this.prisma.program.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Enroll user in program
  async enroll(userId: string, programId: string, dto: EnrollProgramDto) {
    // Check if program exists
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Check if already enrolled
    const existingProgress = await this.prisma.userProgramProgress.findUnique({
      where: {
        userId_programId: { userId, programId },
      },
    });

    if (existingProgress) {
      throw new BadRequestException('Already enrolled in this program');
    }

    const progress = await this.prisma.userProgramProgress.create({
      data: {
        userId,
        programId,
        currentWeek: dto.startWeek || 1,
        currentWorkoutIndex: 0,
      },
      include: {
        program: true,
      },
    });

    this.logger.log(`User ${userId} enrolled in program ${programId}`);

    return {
      programId: progress.programId,
      program: this.formatProgram(progress.program),
      currentWeek: progress.currentWeek,
      currentWorkoutIndex: progress.currentWorkoutIndex,
      startedAt: progress.startedAt.toISOString(),
    };
  }

  // Get user's progress in a program
  async getProgress(userId: string, programId: string) {
    const progress = await this.prisma.userProgramProgress.findUnique({
      where: {
        userId_programId: { userId, programId },
      },
      include: {
        program: {
          include: {
            weeks: {
              include: {
                workouts: {
                  include: {
                    workout: true,
                  },
                  orderBy: { sortOrder: 'asc' },
                },
              },
              orderBy: { weekNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('Not enrolled in this program');
    }

    // Get completed sessions for this program
    const completedSessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        programId,
        completedAt: { not: null },
      },
      select: {
        workoutId: true,
        completedAt: true,
      },
    });

    const completedWorkoutIds = new Set(completedSessions.map((s) => s.workoutId));

    return {
      programId: progress.programId,
      program: this.formatProgram(progress.program),
      currentWeek: progress.currentWeek,
      currentWorkoutIndex: progress.currentWorkoutIndex,
      startedAt: progress.startedAt.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      weeks: progress.program.weeks.map((week) => ({
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        isUnlocked: week.weekNumber <= progress.currentWeek,
        workouts: week.workouts.map((pw) => ({
          id: pw.workout.id,
          title: pw.workout.title,
          duration: pw.workout.durationMinutes,
          difficulty: pw.workout.difficulty,
          dayOfWeek: pw.dayOfWeek,
          isCompleted: completedWorkoutIds.has(pw.workout.id),
        })),
      })),
      totalWorkouts: progress.program.weeks.reduce(
        (acc, w) => acc + w.workouts.length,
        0,
      ),
      completedWorkouts: completedSessions.length,
    };
  }

  // Get all programs user is enrolled in
  async getUserPrograms(userId: string) {
    const enrollments = await this.prisma.userProgramProgress.findMany({
      where: { userId },
      include: {
        program: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    // Get completed workout counts
    const completedCounts = await Promise.all(
      enrollments.map(async (e) => {
        const count = await this.prisma.workoutSession.count({
          where: {
            userId,
            programId: e.programId,
            completedAt: { not: null },
          },
        });
        return { programId: e.programId, count };
      }),
    );

    const countsMap = new Map(completedCounts.map((c) => [c.programId, c.count]));

    return enrollments.map((e) => ({
      programId: e.programId,
      program: this.formatProgram(e.program),
      currentWeek: e.currentWeek,
      startedAt: e.startedAt.toISOString(),
      completedAt: e.completedAt?.toISOString(),
      completedWorkouts: countsMap.get(e.programId) || 0,
    }));
  }

  // Advance to next workout/week
  async advanceProgress(userId: string, programId: string) {
    const progress = await this.prisma.userProgramProgress.findUnique({
      where: {
        userId_programId: { userId, programId },
      },
      include: {
        program: {
          include: {
            weeks: {
              include: {
                workouts: true,
              },
              orderBy: { weekNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('Not enrolled in this program');
    }

    const currentWeekData = progress.program.weeks.find(
      (w) => w.weekNumber === progress.currentWeek,
    );

    if (!currentWeekData) {
      return progress;
    }

    let newWeek = progress.currentWeek;
    let newWorkoutIndex = progress.currentWorkoutIndex + 1;

    // Check if we need to advance to next week
    if (newWorkoutIndex >= currentWeekData.workouts.length) {
      newWorkoutIndex = 0;
      newWeek += 1;
    }

    // Check if program is complete
    const isComplete = newWeek > progress.program.durationWeeks;

    const updatedProgress = await this.prisma.userProgramProgress.update({
      where: {
        userId_programId: { userId, programId },
      },
      data: {
        currentWeek: isComplete ? progress.currentWeek : newWeek,
        currentWorkoutIndex: isComplete ? progress.currentWorkoutIndex : newWorkoutIndex,
        completedAt: isComplete ? new Date() : null,
      },
    });

    this.logger.log(
      `User ${userId} advanced in program ${programId}: week ${updatedProgress.currentWeek}, workout ${updatedProgress.currentWorkoutIndex}`,
    );

    return {
      currentWeek: updatedProgress.currentWeek,
      currentWorkoutIndex: updatedProgress.currentWorkoutIndex,
      isComplete,
    };
  }

  // Helper: Format program for response
  private formatProgram(program: any) {
    return {
      id: program.id,
      title: program.title,
      description: program.description,
      durationWeeks: program.durationWeeks,
      difficulty: program.difficulty,
      category: program.category,
      image: program.imageUrl,
      isPremium: program.isPremium,
      weekCount: program._count?.weeks || program.durationWeeks,
    };
  }

  // Helper: Format program detail with weeks
  private formatProgramDetail(program: any) {
    return {
      id: program.id,
      title: program.title,
      description: program.description,
      durationWeeks: program.durationWeeks,
      difficulty: program.difficulty,
      category: program.category,
      image: program.imageUrl,
      isPremium: program.isPremium,
      weeks: program.weeks.map((week: any) => ({
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        workouts: week.workouts.map((pw: any) => ({
          id: pw.workout.id,
          title: pw.workout.title,
          duration: pw.workout.durationMinutes,
          difficulty: pw.workout.difficulty,
          category: pw.workout.category?.name,
          dayOfWeek: pw.dayOfWeek,
        })),
      })),
    };
  }
}
