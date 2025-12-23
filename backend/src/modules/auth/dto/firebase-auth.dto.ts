import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FirebaseAuthDto {
  @ApiProperty({ description: 'Firebase ID token from the mobile app' })
  @IsNotEmpty()
  @IsString()
  firebaseToken: string;

  @ApiProperty({ required: false, description: 'User name (for new registrations)' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
