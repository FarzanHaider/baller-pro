import { Module } from '@nestjs/common';
import { WorkoutsController } from './controllers/workouts.controller';
import { ProgramsController } from './controllers/programs.controller';
import { WorkoutsService } from './services/workouts.service';
import { ProgramsService } from './services/programs.service';

@Module({
  controllers: [WorkoutsController, ProgramsController],
  providers: [WorkoutsService, ProgramsService],
  exports: [WorkoutsService, ProgramsService],
})
export class TrainingModule {}
