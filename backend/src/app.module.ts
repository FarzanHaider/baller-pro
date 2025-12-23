import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import configuration from './config/configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TrainingModule } from './modules/training/training.module';
import { HabitsModule } from './modules/habits/habits.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { CommunityModule } from './modules/community/community.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { ShopModule } from './modules/shop/shop.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    TrainingModule,
    HabitsModule,
    NutritionModule,
    CommunityModule,
    ChallengesModule,
    SubscriptionsModule,
    ReferralsModule,
    ShopModule,
    NotificationsModule,
  ],
  providers: [
    // Global exception filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },

    // Global response transformer
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // Global auth guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
