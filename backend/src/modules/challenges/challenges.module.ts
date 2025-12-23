import { Module } from '@nestjs/common';
import { ChallengesController } from './controllers/challenges.controller';
import { LeaderboardController } from './controllers/leaderboard.controller';
import { ChallengesService } from './services/challenges.service';
import { LeaderboardService } from './services/leaderboard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChallengesController, LeaderboardController],
  providers: [ChallengesService, LeaderboardService],
  exports: [ChallengesService, LeaderboardService],
})
export class ChallengesModule {}
