import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ChallengeType {
  STEPS = 'steps',
  WORKOUTS = 'workouts',
  STREAK = 'streak',
  CUSTOM = 'custom',
}

export class CreateChallengeDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ChallengeType })
  @IsEnum(ChallengeType)
  challengeType: ChallengeType;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  targetValue?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateChallengeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  targetValue?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProgressDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  value: number;
}

export class ChallengeFilterDto {
  @ApiPropertyOptional({ enum: ['active', 'upcoming', 'completed', 'all'], default: 'active' })
  @IsEnum(['active', 'upcoming', 'completed', 'all'])
  @IsOptional()
  status?: 'active' | 'upcoming' | 'completed' | 'all' = 'active';

  @ApiPropertyOptional({ enum: ChallengeType })
  @IsEnum(ChallengeType)
  @IsOptional()
  type?: ChallengeType;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20;
}

export class LeaderboardFilterDto {
  @ApiPropertyOptional({ enum: ['weekly', 'monthly', 'all_time'], default: 'weekly' })
  @IsEnum(['weekly', 'monthly', 'all_time'])
  @IsOptional()
  period?: 'weekly' | 'monthly' | 'all_time' = 'weekly';

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
