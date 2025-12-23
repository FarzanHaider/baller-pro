import { Module } from '@nestjs/common';
import { MealsController } from './controllers/meals.controller';
import { TargetsController } from './controllers/targets.controller';
import { RecipesController } from './controllers/recipes.controller';
import { MealsService } from './services/meals.service';
import { TargetsService } from './services/targets.service';
import { RecipesService } from './services/recipes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MealsController, TargetsController, RecipesController],
  providers: [MealsService, TargetsService, RecipesService],
  exports: [MealsService, TargetsService, RecipesService],
})
export class NutritionModule {}
