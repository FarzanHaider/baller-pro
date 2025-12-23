import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReferralStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REWARDED = 'Rewarded',
}

export class CreateReferralDto {
  @ApiProperty()
  @IsEmail()
  referredEmail: string;
}

export class ApplyReferralCodeDto {
  @ApiProperty()
  @IsString()
  code: string;
}
