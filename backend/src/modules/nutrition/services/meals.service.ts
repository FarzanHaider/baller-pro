import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogMealDto, UpdateMealDto, MealFilterDto } from '../dto';

@Injectable()
export class MealsService {
  private readonly logger = new Logger(MealsService.name);

  constructor(private prisma: PrismaService) {}

  // Get meals for a user (filtered by date)
  async findAll(userId: string, filters: MealFilterDto) {
    const targetDate = filters.date ? new Date(filters.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const where: any = {
      userId,
      loggedDate: targetDate,
    };

    if (filters.mealType) {
      where.mealType = filters.mealType;
    }

    const meals = await this.prisma.mealLog.findMany({
      where,
      orderBy: { loggedAt: 'asc' },
    });

    // Calculate totals
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        proteinG: acc.proteinG + (Number(meal.proteinG) || 0),
        carbsG: acc.carbsG + (Number(meal.carbsG) || 0),
        fatsG: acc.fatsG + (Number(meal.fatsG) || 0),
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatsG: 0 },
    );

    return {
      date: targetDate.toISOString().split('T')[0],
      meals: meals.map((m) => this.formatMeal(m)),
      totals: {
        calories: totals.calories,
        protein: Math.round(totals.proteinG * 10) / 10,
        carbs: Math.round(totals.carbsG * 10) / 10,
        fats: Math.round(totals.fatsG * 10) / 10,
      },
    };
  }

  // Log a meal
  async create(userId: string, logMealDto: LogMealDto) {
    const loggedDate = logMealDto.loggedDate
      ? new Date(logMealDto.loggedDate)
      : new Date();
    loggedDate.setHours(0, 0, 0, 0);

    const meal = await this.prisma.mealLog.create({
      data: {
        userId,
        mealType: logMealDto.mealType,
        name: logMealDto.name,
        description: logMealDto.description,
        calories: logMealDto.calories,
        proteinG: logMealDto.proteinG,
        carbsG: logMealDto.carbsG,
        fatsG: logMealDto.fatsG,
        loggedDate,
        barcode: logMealDto.barcode,
        imageUrl: logMealDto.imageUrl,
      },
    });

    this.logger.log(`User ${userId} logged meal: ${meal.name}`);

    return this.formatMeal(meal);
  }

  // Update a meal
  async update(userId: string, mealId: string, updateMealDto: UpdateMealDto) {
    const existing = await this.prisma.mealLog.findFirst({
      where: { id: mealId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Meal not found');
    }

    const meal = await this.prisma.mealLog.update({
      where: { id: mealId },
      data: updateMealDto,
    });

    return this.formatMeal(meal);
  }

  // Delete a meal
  async remove(userId: string, mealId: string) {
    const existing = await this.prisma.mealLog.findFirst({
      where: { id: mealId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Meal not found');
    }

    await this.prisma.mealLog.delete({
      where: { id: mealId },
    });

    this.logger.log(`User ${userId} deleted meal ${mealId}`);
  }

  // Get nutrition summary for a date range
  async getSummary(userId: string, startDate?: string, endDate?: string) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const meals = await this.prisma.mealLog.findMany({
      where: {
        userId,
        loggedDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { loggedDate: 'asc' },
    });

    // Group by date
    const dailyData = new Map<string, any>();

    for (const meal of meals) {
      const dateKey = meal.loggedDate.toISOString().split('T')[0];
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date: dateKey,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          mealCount: 0,
        });
      }

      const day = dailyData.get(dateKey)!;
      day.calories += meal.calories;
      day.protein += Number(meal.proteinG) || 0;
      day.carbs += Number(meal.carbsG) || 0;
      day.fats += Number(meal.fatsG) || 0;
      day.mealCount += 1;
    }

    const days = Array.from(dailyData.values()).map((d) => ({
      ...d,
      protein: Math.round(d.protein * 10) / 10,
      carbs: Math.round(d.carbs * 10) / 10,
      fats: Math.round(d.fats * 10) / 10,
    }));

    const avgCalories =
      days.length > 0
        ? Math.round(days.reduce((sum, d) => sum + d.calories, 0) / days.length)
        : 0;

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      days,
      averages: {
        calories: avgCalories,
        protein: Math.round(
          days.reduce((sum, d) => sum + d.protein, 0) / Math.max(days.length, 1) * 10,
        ) / 10,
        carbs: Math.round(
          days.reduce((sum, d) => sum + d.carbs, 0) / Math.max(days.length, 1) * 10,
        ) / 10,
        fats: Math.round(
          days.reduce((sum, d) => sum + d.fats, 0) / Math.max(days.length, 1) * 10,
        ) / 10,
      },
    };
  }

  private formatMeal(meal: any) {
    return {
      id: meal.id,
      mealType: meal.mealType,
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      macros: {
        protein: Number(meal.proteinG) || 0,
        carbs: Number(meal.carbsG) || 0,
        fats: Number(meal.fatsG) || 0,
      },
      loggedDate: meal.loggedDate.toISOString().split('T')[0],
      loggedAt: meal.loggedAt.toISOString(),
      image: meal.imageUrl,
    };
  }
}
