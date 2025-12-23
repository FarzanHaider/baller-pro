import { IsString, IsOptional, IsEnum, IsArray, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export enum PostType {
  WORKOUT = 'workout',
  ACHIEVEMENT = 'achievement',
  GENERAL = 'general',
}

export class CreatePostDto {
  @ApiProperty({ enum: PostType })
  @IsEnum(PostType)
  type: PostType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Workout session ID if type is workout' })
  @IsString()
  @IsOptional()
  workoutSessionId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ description: 'Achievement data if type is achievement' })
  @IsOptional()
  achievementData?: Record<string, any>;
}

export class UpdatePostDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Parent comment ID for replies' })
  @IsString()
  @IsOptional()
  parentId?: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class FeedFilterDto {
  @ApiPropertyOptional({ enum: ['following', 'all'], default: 'all' })
  @IsEnum(['following', 'all'])
  @IsOptional()
  filter?: 'following' | 'all' = 'all';

  @ApiPropertyOptional({ enum: PostType })
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

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

export class UserSearchDto {
  @ApiProperty()
  @IsString()
  query: string;

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
