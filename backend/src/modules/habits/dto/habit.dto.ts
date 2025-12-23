import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHabitDto {
  @ApiProperty({ example: 'Drink Water' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '8 glasses per day' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'water-drop' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ enum: ['checkbox', 'scheduled'], example: 'checkbox' })
  @IsIn(['checkbox', 'scheduled'])
  type: string;

  @ApiPropertyOptional({
    type: [Number],
    example: [0, 1, 2, 3, 4, 5, 6],
    description: 'Days of week (0=Sunday, 6=Saturday)'
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  scheduleDays?: number[];

  @ApiPropertyOptional({ example: '08:00', description: 'Reminder time in HH:MM format' })
  @IsOptional()
  @IsString()
  reminderTime?: string;
}

export class UpdateHabitDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ enum: ['checkbox', 'scheduled'] })
  @IsOptional()
  @IsIn(['checkbox', 'scheduled'])
  type?: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  scheduleDays?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reminderTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}

export class ToggleHabitDto {
  @ApiPropertyOptional({
    description: 'Date to toggle (defaults to today)',
    example: '2024-01-15'
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class HabitHistoryDto {
  @ApiPropertyOptional({ description: 'Start date for history range' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for history range' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
