import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetNutritionTargetDto } from '../dto';

@Injectable()
export class TargetsService {
  private readonly logger = new Logger(TargetsService.name);

  constructor(private prisma: PrismaService) {}

  // Get user's nutrition targets
  async getTargets(userId: string) {
    const target = await this.prisma.userNutritionTarget.findUnique({
      where: { userId },
    });

    if (!target) {
      // Return default targets
      return {
        calories: 2000,
        macros: {
          protein: 150,
          carbs: 200,
          fats: 65,
        },
        calculationMethod: null,
        isDefault: true,
      };
    }

    return {
      calories: target.calories,
      macros: {
        protein: target.proteinG,
        carbs: target.carbsG,
        fats: target.fatsG,
      },
      calculationMethod: target.calculationMethod,
      lastCalculatedAt: target.lastCalculatedAt?.toISOString(),
      isDefault: false,
    };
  }

  // Set user's nutrition targets
  async setTargets(userId: string, dto: SetNutritionTargetDto) {
    const target = await this.prisma.userNutritionTarget.upsert({
      where: { userId },
      update: {
        calories: dto.calories,
        proteinG: dto.proteinG,
        carbsG: dto.carbsG,
        fatsG: dto.fatsG,
        calculationMethod: dto.calculationMethod || 'manual',
        lastCalculatedAt: new Date(),
      },
      create: {
        userId,
        calories: dto.calories,
        proteinG: dto.proteinG,
        carbsG: dto.carbsG,
        fatsG: dto.fatsG,
        calculationMethod: dto.calculationMethod || 'manual',
        lastCalculatedAt: new Date(),
      },
    });

    this.logger.log(`User ${userId} updated nutrition targets`);

    return {
      calories: target.calories,
      macros: {
        protein: target.proteinG,
        carbs: target.carbsG,
        fats: target.fatsG,
      },
      calculationMethod: target.calculationMethod,
      lastCalculatedAt: target.lastCalculatedAt?.toISOString(),
    };
  }

  // Calculate targets based on user profile (simplified AI calculation)
  async calculateTargets(userId: string) {
    // Get user's onboarding data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user?.onboarding) {
      // Return default targets if no onboarding data
      return this.setTargets(userId, {
        calories: 2000,
        proteinG: 150,
        carbsG: 200,
        fatsG: 65,
        calculationMethod: 'ai_calculated',
      });
    }

    // Simple calculation based on training level and goals
    let baseCalories = 2000;
    let proteinMultiplier = 1.6; // g per kg body weight estimate

    const { trainingLevel, goals } = user.onboarding;

    // Adjust based on training level
    if (trainingLevel === 'beginner') {
      baseCalories = 1800;
      proteinMultiplier = 1.4;
    } else if (trainingLevel === 'intermediate') {
      baseCalories = 2200;
      proteinMultiplier = 1.8;
    } else if (trainingLevel === 'advanced') {
      baseCalories = 2500;
      proteinMultiplier = 2.0;
    }

    // Adjust based on goals (assuming average 75kg body weight)
    const estimatedWeight = 75;
    const proteinG = Math.round(estimatedWeight * proteinMultiplier);

    // Standard macro split: 30% protein, 40% carbs, 30% fat
    const proteinCalories = proteinG * 4;
    const remainingCalories = baseCalories - proteinCalories;
    const carbsG = Math.round((remainingCalories * 0.55) / 4);
    const fatsG = Math.round((remainingCalories * 0.45) / 9);

    return this.setTargets(userId, {
      calories: baseCalories,
      proteinG,
      carbsG,
      fatsG,
      calculationMethod: 'ai_calculated',
    });
  }

  // Get today's progress against targets
  async getTodayProgress(userId: string) {
    const targets = await this.getTargets(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meals = await this.prisma.mealLog.findMany({
      where: {
        userId,
        loggedDate: today,
      },
    });

    const consumed = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + (Number(meal.proteinG) || 0),
        carbs: acc.carbs + (Number(meal.carbsG) || 0),
        fats: acc.fats + (Number(meal.fatsG) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );

    return {
      date: today.toISOString().split('T')[0],
      targets: {
        calories: targets.calories,
        protein: targets.macros.protein,
        carbs: targets.macros.carbs,
        fats: targets.macros.fats,
      },
      consumed: {
        calories: consumed.calories,
        protein: Math.round(consumed.protein * 10) / 10,
        carbs: Math.round(consumed.carbs * 10) / 10,
        fats: Math.round(consumed.fats * 10) / 10,
      },
      remaining: {
        calories: Math.max(0, targets.calories - consumed.calories),
        protein: Math.max(0, targets.macros.protein - consumed.protein),
        carbs: Math.max(0, targets.macros.carbs - consumed.carbs),
        fats: Math.max(0, targets.macros.fats - consumed.fats),
      },
      percentages: {
        calories: Math.min(100, Math.round((consumed.calories / targets.calories) * 100)),
        protein: Math.min(100, Math.round((consumed.protein / targets.macros.protein) * 100)),
        carbs: Math.min(100, Math.round((consumed.carbs / targets.macros.carbs) * 100)),
        fats: Math.min(100, Math.round((consumed.fats / targets.macros.fats) * 100)),
      },
    };
  }
}
