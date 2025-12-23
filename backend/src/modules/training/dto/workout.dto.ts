import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  IsIn,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Full Body Strength' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  difficulty: string;

  @ApiPropertyOptional({ enum: ['Gym', 'Field', 'Home'] })
  @IsOptional()
  @IsIn(['Gym', 'Field', 'Home'])
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;
}

export class UpdateWorkoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  difficulty?: string;

  @ApiPropertyOptional({ enum: ['Gym', 'Field', 'Home'] })
  @IsOptional()
  @IsIn(['Gym', 'Field', 'Home'])
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class WorkoutFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  difficulty?: string;

  @ApiPropertyOptional({ enum: ['Gym', 'Field', 'Home'] })
  @IsOptional()
  @IsIn(['Gym', 'Field', 'Home'])
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

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

export class StartSessionDto {
  @ApiPropertyOptional({ description: 'Program ID if workout is part of a program' })
  @IsOptional()
  @IsUUID()
  programId?: string;
}

export class CompleteSessionDto {
  @ApiProperty({ description: 'Duration in seconds' })
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  caloriesBurned?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  heartRateAvg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  rating?: number;
}
