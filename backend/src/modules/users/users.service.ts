import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, OnboardingDto } from './dto';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  isEmailVerified: boolean;
  isPremium: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface OnboardingResponse {
  gender?: string;
  trainingLevel?: string;
  goals: string[];
  injuries: string[];
  customInjury?: string;
  experienceLevel?: string;
  completed: boolean;
  completedAt?: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  // Get current user profile
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        onboarding: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserResponse(user);
  }

  // Update user profile
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateProfileDto.name,
        avatarUrl: updateProfileDto.avatarUrl,
      },
      include: {
        onboarding: true,
      },
    });

    return this.formatUserResponse(user);
  }

  // Get onboarding data
  async getOnboarding(userId: string): Promise<OnboardingResponse | null> {
    const onboarding = await this.prisma.userOnboarding.findUnique({
      where: { userId },
    });

    if (!onboarding) {
      return null;
    }

    return this.formatOnboardingResponse(onboarding);
  }

  // Save/update onboarding data
  async saveOnboarding(
    userId: string,
    onboardingDto: OnboardingDto,
  ): Promise<OnboardingResponse> {
    const data: any = {
      gender: onboardingDto.gender,
      trainingLevel: onboardingDto.trainingLevel,
      goals: onboardingDto.goals || [],
      injuries: onboardingDto.injuries || [],
      customInjury: onboardingDto.customInjury,
      experienceLevel: onboardingDto.experienceLevel,
    };

    // If completed flag is set, mark as completed
    if (onboardingDto.completed) {
      data.completed = true;
      data.completedAt = new Date();
    }

    const onboarding = await this.prisma.userOnboarding.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    this.logger.log(`Onboarding saved for user ${userId}`);

    return this.formatOnboardingResponse(onboarding);
  }

  // Get user by ID (internal use)
  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        onboarding: true,
      },
    });
  }

  // Get user by Firebase UID
  async findByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        onboarding: true,
      },
    });
  }

  // Get user by email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        onboarding: true,
      },
    });
  }

  // Helper: Format user response
  private formatUserResponse(user: any): UserResponse {
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

  // Helper: Format onboarding response
  private formatOnboardingResponse(onboarding: any): OnboardingResponse {
    return {
      gender: onboarding.gender,
      trainingLevel: onboarding.trainingLevel,
      goals: onboarding.goals || [],
      injuries: onboarding.injuries || [],
      customInjury: onboarding.customInjury,
      experienceLevel: onboarding.experienceLevel,
      completed: onboarding.completed,
      completedAt: onboarding.completedAt?.toISOString(),
    };
  }
}
