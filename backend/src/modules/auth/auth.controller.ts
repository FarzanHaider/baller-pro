import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, FirebaseAuthDto, RefreshTokenDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  createSuccessResponse,
  ApiResponseDto,
} from '../../common/dto/api-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponseDto<AuthResponse>> {
    const result = await this.authService.register(registerDto);
    return createSuccessResponse(result, 'User registered successfully');
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<AuthResponse>> {
    const result = await this.authService.login(loginDto);
    return createSuccessResponse(result, 'Login successful');
  }

  @Post('firebase')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange Firebase ID token for app tokens' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
  async firebaseAuth(
    @Body() firebaseAuthDto: FirebaseAuthDto,
  ): Promise<ApiResponseDto<AuthResponse>> {
    const result = await this.authService.firebaseAuth(firebaseAuthDto);
    return createSuccessResponse(result, 'Authentication successful');
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseDto<{ token: string }>> {
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    return createSuccessResponse(result, 'Token refreshed successfully');
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke tokens' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@CurrentUser() user: JwtPayload): Promise<ApiResponseDto<null>> {
    await this.authService.logout(user.sub);
    return createSuccessResponse(null, 'Logout successful');
  }
}
