import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkoutsService } from '../services/workouts.service';
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutFilterDto,
  StartSessionDto,
  CompleteSessionDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import {
  createSuccessResponse,
  createPaginatedResponse,
  ApiResponseDto,
} from '../../../common/dto/api-response.dto';

@ApiTags('training')
@Controller('training/workouts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  @ApiOperation({ summary: 'List all workouts with optional filters' })
  @ApiResponse({ status: 200, description: 'Workouts retrieved successfully' })
  async findAll(
    @Query() filters: WorkoutFilterDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workoutsService.findAll(filters, user?.sub);
    return createPaginatedResponse(
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Workouts retrieved successfully',
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all workout categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    const categories = await this.workoutsService.getCategories();
    return createSuccessResponse(categories, 'Categories retrieved successfully');
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get user workout history' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  async getUserSessions(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.workoutsService.getUserSessions(
      user.sub,
      page || 1,
      limit || 20,
    );
    return createPaginatedResponse(
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Sessions retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workout by ID with exercises' })
  @ApiResponse({ status: 200, description: 'Workout retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  async findOne(@Param('id') id: string) {
    const workout = await this.workoutsService.findOne(id);
    return createSuccessResponse(workout, 'Workout retrieved successfully');
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new workout (Admin only)' })
  @ApiResponse({ status: 201, description: 'Workout created successfully' })
  async create(@Body() createWorkoutDto: CreateWorkoutDto) {
    const workout = await this.workoutsService.create(createWorkoutDto);
    return createSuccessResponse(workout, 'Workout created successfully');
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a workout (Admin only)' })
  @ApiResponse({ status: 200, description: 'Workout updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    const workout = await this.workoutsService.update(id, updateWorkoutDto);
    return createSuccessResponse(workout, 'Workout updated successfully');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a workout (Admin only)' })
  @ApiResponse({ status: 200, description: 'Workout deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.workoutsService.remove(id);
    return createSuccessResponse(null, 'Workout deleted successfully');
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a workout session' })
  @ApiResponse({ status: 201, description: 'Session started successfully' })
  async startSession(
    @CurrentUser() user: JwtPayload,
    @Param('id') workoutId: string,
    @Body() dto: StartSessionDto,
  ) {
    const session = await this.workoutsService.startSession(
      user.sub,
      workoutId,
      dto,
    );
    return createSuccessResponse(session, 'Session started successfully');
  }

  @Post('sessions/:sessionId/complete')
  @ApiOperation({ summary: 'Complete a workout session' })
  @ApiResponse({ status: 200, description: 'Session completed successfully' })
  async completeSession(
    @CurrentUser() user: JwtPayload,
    @Param('sessionId') sessionId: string,
    @Body() dto: CompleteSessionDto,
  ) {
    const session = await this.workoutsService.completeSession(
      user.sub,
      sessionId,
      dto,
    );
    return createSuccessResponse(session, 'Session completed successfully');
  }
}
