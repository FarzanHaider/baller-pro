import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { CommentsController } from './controllers/comments.controller';
import { FollowsController } from './controllers/follows.controller';
import { PostsService } from './services/posts.service';
import { CommentsService } from './services/comments.service';
import { FollowsService } from './services/follows.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController, CommentsController, FollowsController],
  providers: [PostsService, CommentsService, FollowsService],
  exports: [PostsService, CommentsService, FollowsService],
})
export class CommunityModule {}
