import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutFilterDto,
  StartSessionDto,
  CompleteSessionDto,
} from '../dto';

@Injectable()
export class WorkoutsService {
  private readonly logger = new Logger(WorkoutsService.name);

  constructor(private prisma: PrismaService) {}

  // List workouts with filters
  async findAll(filters: WorkoutFilterDto, userId?: string) {
    const { categoryId, difficulty, location, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (location) {
      where.location = location;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [workouts, total] = await Promise.all([
      this.prisma.workout.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { exercises: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.workout.count({ where }),
    ]);

    return {
      items: workouts.map((w) => this.formatWorkout(w)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get workout by ID with exercises
  async findOne(id: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        category: true,
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return this.formatWorkoutDetail(workout);
  }

  // Create workout (admin)
  async create(createWorkoutDto: CreateWorkoutDto) {
    const workout = await this.prisma.workout.create({
      data: {
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        categoryId: createWorkoutDto.categoryId,
        durationMinutes: createWorkoutDto.durationMinutes,
        difficulty: createWorkoutDto.difficulty,
        location: createWorkoutDto.location,
        imageUrl: createWorkoutDto.imageUrl,
        videoUrl: createWorkoutDto.videoUrl,
        tags: createWorkoutDto.tags || [],
        isPremium: createWorkoutDto.isPremium || false,
      },
      include: {
        category: true,
      },
    });

    return this.formatWorkout(workout);
  }

  // Update workout (admin)
  async update(id: string, updateWorkoutDto: UpdateWorkoutDto) {
    const workout = await this.prisma.workout.update({
      where: { id },
      data: updateWorkoutDto,
      include: {
        category: true,
      },
    });

    return this.formatWorkout(workout);
  }

  // Delete workout (admin) - soft delete
  async remove(id: string) {
    await this.prisma.workout.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Start a workout session
  async startSession(userId: string, workoutId: string, dto: StartSessionDto) {
    // Verify workout exists
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    const session = await this.prisma.workoutSession.create({
      data: {
        userId,
        workoutId,
        programId: dto.programId,
        startedAt: new Date(),
      },
      include: {
        workout: {
          include: {
            category: true,
          },
        },
      },
    });

    this.logger.log(`User ${userId} started workout session ${session.id}`);

    return {
      id: session.id,
      workoutId: session.workoutId,
      workout: this.formatWorkout(session.workout),
      programId: session.programId,
      startedAt: session.startedAt.toISOString(),
    };
  }

  // Complete a workout session
  async completeSession(userId: string, sessionId: string, dto: CompleteSessionDto) {
    // Verify session exists and belongs to user
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId,
        completedAt: null,
      },
    });

    if (!session) {
      throw new NotFoundException('Active session not found');
    }

    const updatedSession = await this.prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        durationSeconds: dto.durationSeconds,
        caloriesBurned: dto.caloriesBurned,
        heartRateAvg: dto.heartRateAvg,
        notes: dto.notes,
        mood: dto.mood,
        rating: dto.rating,
      },
      include: {
        workout: {
          include: {
            category: true,
          },
        },
      },
    });

    this.logger.log(`User ${userId} completed workout session ${sessionId}`);

    return {
      id: updatedSession.id,
      workoutId: updatedSession.workoutId,
      workout: this.formatWorkout(updatedSession.workout),
      programId: updatedSession.programId,
      startedAt: updatedSession.startedAt.toISOString(),
      completedAt: updatedSession.completedAt?.toISOString(),
      durationSeconds: updatedSession.durationSeconds,
      caloriesBurned: updatedSession.caloriesBurned,
      rating: updatedSession.rating,
    };
  }

  // Get user's workout history
  async getUserSessions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.prisma.workoutSession.findMany({
        where: { userId },
        include: {
          workout: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { startedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.workoutSession.count({ where: { userId } }),
    ]);

    return {
      items: sessions.map((s) => ({
        id: s.id,
        workout: this.formatWorkout(s.workout),
        startedAt: s.startedAt.toISOString(),
        completedAt: s.completedAt?.toISOString(),
        durationSeconds: s.durationSeconds,
        caloriesBurned: s.caloriesBurned,
        rating: s.rating,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get workout categories
  async getCategories() {
    const categories = await this.prisma.workoutCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
    }));
  }

  // Helper: Format workout for response
  private formatWorkout(workout: any) {
    return {
      id: workout.id,
      title: workout.title,
      description: workout.description,
      category: workout.category?.name || null,
      categoryId: workout.categoryId,
      duration: workout.durationMinutes,
      difficulty: workout.difficulty,
      location: workout.location,
      image: workout.imageUrl,
      tags: workout.tags,
      isPremium: workout.isPremium,
      exerciseCount: workout._count?.exercises || 0,
    };
  }

  // Helper: Format workout detail with exercises
  private formatWorkoutDetail(workout: any) {
    return {
      id: workout.id,
      title: workout.title,
      description: workout.description,
      category: workout.category?.name || null,
      categoryId: workout.categoryId,
      duration: workout.durationMinutes,
      difficulty: workout.difficulty,
      location: workout.location,
      image: workout.imageUrl,
      video: workout.videoUrl,
      tags: workout.tags,
      isPremium: workout.isPremium,
      exercises: workout.exercises.map((we: any) => ({
        id: we.exercise.id,
        name: we.exercise.name,
        description: we.exercise.description,
        instructions: we.exercise.instructions,
        sets: we.sets,
        reps: we.reps,
        restSeconds: we.restSeconds,
        video: we.exercise.videoUrl,
        thumbnail: we.exercise.thumbnailUrl,
      })),
    };
  }
}
