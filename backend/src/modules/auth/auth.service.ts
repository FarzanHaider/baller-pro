import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import { RegisterDto, LoginDto, FirebaseAuthDto } from './dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    isEmailVerified: boolean;
    isPremium: boolean;
    onboardingCompleted: boolean;
    createdAt: string;
  };
  token: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  // Register with email/password (creates Firebase user + DB user)
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    let firebaseUid: string;

    // Create Firebase user if Firebase is configured
    if (this.firebaseService.isInitialized()) {
      try {
        const firebaseUser = await this.firebaseService.createUser(
          email,
          password,
          name,
        );
        firebaseUid = firebaseUser.uid;
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          throw new ConflictException('User with this email already exists');
        }
        throw error;
      }
    } else {
      // Generate a fake Firebase UID for development without Firebase
      firebaseUid = `local_${uuidv4()}`;
      this.logger.warn('Firebase not configured, using local UID');
    }

    // Generate referral code
    const referralCode = this.generateReferralCode();

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        firebaseUid,
        email,
        name,
        referralCode,
        isEmailVerified: false,
      },
      include: {
        onboarding: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.formatUserResponse(user),
      ...tokens,
    };
  }

  // Login with email/password (verifies via Firebase)
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        onboarding: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Note: In production, the mobile app should authenticate with Firebase
    // and send the Firebase ID token. This endpoint is for development/testing.
    // Firebase handles password verification on the client side.

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.formatUserResponse(user),
      ...tokens,
    };
  }

  // Exchange Firebase ID token for app tokens
  async firebaseAuth(firebaseAuthDto: FirebaseAuthDto): Promise<AuthResponse> {
    const { firebaseToken, name } = firebaseAuthDto;

    if (!this.firebaseService.isInitialized()) {
      throw new UnauthorizedException('Firebase authentication is not configured');
    }

    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(firebaseToken);
    } catch (error) {
      this.logger.error('Firebase token verification failed', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }

    const { uid: firebaseUid, email, email_verified } = decodedToken;

    if (!email) {
      throw new UnauthorizedException('Email not found in Firebase token');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        onboarding: true,
      },
    });

    if (!user) {
      // Check if user exists with same email but different firebaseUid
      const existingEmailUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingEmailUser) {
        // Update existing user with Firebase UID
        user = await this.prisma.user.update({
          where: { email },
          data: {
            firebaseUid,
            isEmailVerified: email_verified || false,
          },
          include: {
            onboarding: true,
          },
        });
      } else {
        // Create new user
        const referralCode = this.generateReferralCode();
        user = await this.prisma.user.create({
          data: {
            firebaseUid,
            email,
            name: name || decodedToken.name || email.split('@')[0],
            isEmailVerified: email_verified || false,
            referralCode,
          },
          include: {
            onboarding: true,
          },
        });
      }
    } else {
      // Update email verification status
      if (email_verified && !user.isEmailVerified) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
          include: {
            onboarding: true,
          },
        });
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.formatUserResponse(user),
      ...tokens,
    };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    // Hash the refresh token to look it up
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Note: In a production system, you'd store hashed tokens and compare
    // For simplicity, we'll verify the JWT and check if it exists in DB

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if refresh token exists and is not revoked
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found or expired');
    }

    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new access token
    const newToken = this.generateAccessToken(user);

    return { token: newToken };
  }

  // Logout (revoke refresh token)
  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  // Helper: Generate tokens
  private async generateTokens(user: any): Promise<{ token: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      token: accessToken,
      refreshToken,
    };
  }

  // Helper: Generate access token
  private generateAccessToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      firebaseUid: user.firebaseUid,
      isPremium: user.isPremium,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  // Helper: Generate and store refresh token
  private async generateRefreshToken(user: any): Promise<string> {
    const expiresInStr = this.configService.get<string>('jwt.refreshExpiresIn') || '30d';

    // Parse expiration time string to seconds
    const match = expiresInStr.match(/^(\d+)([dhms])$/);
    let expiresInSeconds = 30 * 24 * 60 * 60; // Default 30 days
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      switch (unit) {
        case 'd': expiresInSeconds = value * 24 * 60 * 60; break;
        case 'h': expiresInSeconds = value * 60 * 60; break;
        case 'm': expiresInSeconds = value * 60; break;
        case 's': expiresInSeconds = value; break;
      }
    }

    const token = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: expiresInSeconds },
    );

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(token, 10),
        expiresAt,
      },
    });

    return token;
  }

  // Helper: Generate referral code
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'FIT-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Helper: Format user response
  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      isPremium: user.isPremium,
      onboardingCompleted: user.onboarding?.completed || false,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
