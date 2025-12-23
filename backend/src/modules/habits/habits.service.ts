import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto, UpdateHabitDto } from './dto';

@Injectable()
export class HabitsService {
  private readonly logger = new Logger(HabitsService.name);

  constructor(private prisma: PrismaService) {}

  // Get all habits for a user
  async findAll(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        streak: true,
        completions: {
          where: {
            completedDate: today,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return habits.map((habit) => this.formatHabit(habit, today));
  }

  // Get habit by ID
  async findOne(userId: string, habitId: string) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
      include: {
        streak: true,
      },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return this.formatHabit(habit);
  }

  // Create a new habit
  async create(userId: string, createHabitDto: CreateHabitDto) {
    const habit = await this.prisma.habit.create({
      data: {
        userId,
        title: createHabitDto.title,
        subtitle: createHabitDto.subtitle,
        icon: createHabitDto.icon,
        type: createHabitDto.type,
        scheduleDays: createHabitDto.scheduleDays || [],
        reminderTime: createHabitDto.reminderTime,
      },
    });

    // Create streak record
    await this.prisma.habitStreak.create({
      data: {
        habitId: habit.id,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    this.logger.log(`Created habit ${habit.id} for user ${userId}`);

    return this.formatHabit(habit);
  }

  // Update a habit
  async update(userId: string, habitId: string, updateHabitDto: UpdateHabitDto) {
    // Verify ownership
    const existing = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Habit not found');
    }

    const habit = await this.prisma.habit.update({
      where: { id: habitId },
      data: updateHabitDto,
      include: {
        streak: true,
      },
    });

    return this.formatHabit(habit);
  }

  // Delete a habit (soft delete)
  async remove(userId: string, habitId: string) {
    const existing = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Habit not found');
    }

    await this.prisma.habit.update({
      where: { id: habitId },
      data: { isActive: false },
    });

    this.logger.log(`Deleted habit ${habitId}`);
  }

  // Toggle habit completion for a date
  async toggleCompletion(userId: string, habitId: string, date?: string) {
    // Verify ownership
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
      include: { streak: true },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Check if already completed
    const existingCompletion = await this.prisma.habitCompletion.findUnique({
      where: {
        habitId_completedDate: {
          habitId,
          completedDate: targetDate,
        },
      },
    });

    let completed: boolean;

    if (existingCompletion) {
      // Remove completion
      await this.prisma.habitCompletion.delete({
        where: { id: existingCompletion.id },
      });
      completed = false;
    } else {
      // Add completion
      await this.prisma.habitCompletion.create({
        data: {
          habitId,
          userId,
          completedDate: targetDate,
        },
      });
      completed = true;
    }

    // Update streak
    await this.updateStreak(habitId);

    const updatedHabit = await this.prisma.habit.findUnique({
      where: { id: habitId },
      include: { streak: true },
    });

    this.logger.log(
      `Habit ${habitId} ${completed ? 'completed' : 'uncompleted'} for ${targetDate.toISOString().split('T')[0]}`,
    );

    return {
      habitId,
      date: targetDate.toISOString().split('T')[0],
      completed,
      currentStreak: updatedHabit?.streak?.currentStreak || 0,
      longestStreak: updatedHabit?.streak?.longestStreak || 0,
    };
  }

  // Get habit completion history
  async getHistory(userId: string, habitId: string, startDate?: string, endDate?: string) {
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const completions = await this.prisma.habitCompletion.findMany({
      where: {
        habitId,
        completedDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { completedDate: 'desc' },
    });

    return {
      habitId,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      completedDates: completions.map((c) => c.completedDate.toISOString().split('T')[0]),
      totalCompletions: completions.length,
    };
  }

  // Get all streaks for a user
  async getStreaks(userId: string) {
    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        streak: true,
      },
    });

    const totalCurrentStreak = habits.reduce(
      (sum, h) => sum + (h.streak?.currentStreak || 0),
      0,
    );
    const longestStreak = Math.max(
      ...habits.map((h) => h.streak?.longestStreak || 0),
      0,
    );

    return {
      habits: habits.map((h) => ({
        id: h.id,
        title: h.title,
        currentStreak: h.streak?.currentStreak || 0,
        longestStreak: h.streak?.longestStreak || 0,
        lastCompleted: h.streak?.lastCompletedDate?.toISOString().split('T')[0] || null,
      })),
      summary: {
        totalHabits: habits.length,
        totalCurrentStreak,
        longestStreak,
      },
    };
  }

  // Update streak for a habit
  private async updateStreak(habitId: string) {
    const completions = await this.prisma.habitCompletion.findMany({
      where: { habitId },
      orderBy: { completedDate: 'desc' },
    });

    if (completions.length === 0) {
      await this.prisma.habitStreak.upsert({
        where: { habitId },
        update: {
          currentStreak: 0,
          lastCompletedDate: null,
        },
        create: {
          habitId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedDates = completions
      .map((c) => {
        const d = new Date(c.completedDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
      .sort((a, b) => b - a);

    // Check if most recent is today or yesterday
    const mostRecent = sortedDates[0];
    const diffFromToday = Math.floor((today.getTime() - mostRecent) / (24 * 60 * 60 * 1000));

    if (diffFromToday <= 1) {
      currentStreak = 1;
      let prevDate = mostRecent;

      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = sortedDates[i];
        const diff = Math.floor((prevDate - currentDate) / (24 * 60 * 60 * 1000));

        if (diff === 1) {
          currentStreak++;
          prevDate = currentDate;
        } else {
          break;
        }
      }
    }

    // Get existing streak to preserve longest
    const existingStreak = await this.prisma.habitStreak.findUnique({
      where: { habitId },
    });

    const longestStreak = Math.max(
      currentStreak,
      existingStreak?.longestStreak || 0,
    );

    await this.prisma.habitStreak.upsert({
      where: { habitId },
      update: {
        currentStreak,
        longestStreak,
        lastCompletedDate: new Date(mostRecent),
      },
      create: {
        habitId,
        currentStreak,
        longestStreak,
        lastCompletedDate: new Date(mostRecent),
      },
    });
  }

  // Format habit for response
  private formatHabit(habit: any, today?: Date) {
    const isCompletedToday = habit.completions?.length > 0;

    return {
      id: habit.id,
      title: habit.title,
      subtitle: habit.subtitle,
      icon: habit.icon,
      type: habit.type,
      scheduleDays: habit.scheduleDays,
      reminderTime: habit.reminderTime,
      completed: isCompletedToday,
      currentStreak: habit.streak?.currentStreak || 0,
      longestStreak: habit.streak?.longestStreak || 0,
      createdAt: habit.createdAt.toISOString(),
    };
  }
}
