import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsIn,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProgramDto {
  @ApiProperty({ example: '12-Week Football Conditioning' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  durationWeeks: number;

  @ApiProperty({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  difficulty: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;
}

export class UpdateProgramDto {
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
  @IsInt()
  @Min(1)
  durationWeeks?: number;

  @ApiPropertyOptional({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  difficulty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProgramFilterDto {
  @ApiPropertyOptional({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  difficulty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

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

export class EnrollProgramDto {
  @ApiPropertyOptional({ description: 'Start at a specific week (default: 1)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  startWeek?: number;
}
