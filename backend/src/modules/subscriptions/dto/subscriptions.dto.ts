import { IsString, IsOptional, IsInt, IsBoolean, Min, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SubscriptionProvider {
  REVENUECAT = 'revenuecat',
  APPLE = 'apple',
  GOOGLE = 'google',
  STRIPE = 'stripe',
}

export class CreatePlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceCents: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty({ enum: ['month', 'year'] })
  @IsEnum(['month', 'year'])
  interval: 'month' | 'year';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  appleProductId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  googleProductId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}

export class ValidateReceiptDto {
  @ApiProperty({ enum: SubscriptionProvider })
  @IsEnum(SubscriptionProvider)
  provider: SubscriptionProvider;

  @ApiProperty()
  @IsString()
  receipt: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productId?: string;
}

export class RevenueCatWebhookDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  event: any;
}
