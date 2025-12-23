import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsIn,
  IsDateString,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ==================== NUTRITION TARGETS ====================

export class SetNutritionTargetDto {
  @ApiProperty({ example: 2000 })
  @IsInt()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 150 })
  @IsInt()
  @Min(0)
  proteinG: number;

  @ApiProperty({ example: 200 })
  @IsInt()
  @Min(0)
  carbsG: number;

  @ApiProperty({ example: 65 })
  @IsInt()
  @Min(0)
  fatsG: number;

  @ApiPropertyOptional({ enum: ['manual', 'ai_calculated'] })
  @IsOptional()
  @IsIn(['manual', 'ai_calculated'])
  calculationMethod?: string;
}

// ==================== MEAL LOGGING ====================

export class LogMealDto {
  @ApiProperty({ enum: ['breakfast', 'lunch', 'dinner', 'snack'] })
  @IsIn(['breakfast', 'lunch', 'dinner', 'snack'])
  mealType: string;

  @ApiProperty({ example: 'Grilled Chicken Salad' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 450 })
  @IsInt()
  @Min(0)
  calories: number;

  @ApiPropertyOptional({ example: 35.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  proteinG?: number;

  @ApiPropertyOptional({ example: 20.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbsG?: number;

  @ApiPropertyOptional({ example: 15.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fatsG?: number;

  @ApiPropertyOptional({ description: 'Date for the meal (defaults to today)' })
  @IsOptional()
  @IsDateString()
  loggedDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateMealDto {
  @ApiPropertyOptional({ enum: ['breakfast', 'lunch', 'dinner', 'snack'] })
  @IsOptional()
  @IsIn(['breakfast', 'lunch', 'dinner', 'snack'])
  mealType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  proteinG?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbsG?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  fatsG?: number;
}

export class MealFilterDto {
  @ApiPropertyOptional({ description: 'Filter by date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ enum: ['breakfast', 'lunch', 'dinner', 'snack'] })
  @IsOptional()
  @IsIn(['breakfast', 'lunch', 'dinner', 'snack'])
  mealType?: string;
}

// ==================== RECIPES ====================

export class RecipeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: [String], description: 'Filter by tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  calories: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  proteinG: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  carbsG: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  fatsG: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  prepTimeMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  cookTimeMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;

  @ApiProperty({ type: 'array', description: 'List of ingredients' })
  @IsArray()
  ingredients: any[];

  @ApiProperty({ type: 'array', description: 'List of instructions' })
  @IsArray()
  instructions: any[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
