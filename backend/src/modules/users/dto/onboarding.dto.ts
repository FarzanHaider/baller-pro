import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingDto {
  @ApiProperty({ enum: ['male', 'female', 'other'], required: false })
  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsIn(['beginner', 'intermediate', 'advanced'])
  trainingLevel?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  injuries?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customInjury?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
