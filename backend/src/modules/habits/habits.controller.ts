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
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto, ToggleHabitDto, HabitHistoryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../common/dto/api-response.dto';

@ApiTags('habits')
@Controller('habits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all habits for current user' })
  @ApiResponse({ status: 200, description: 'Habits retrieved successfully' })
  async findAll(@CurrentUser() user: JwtPayload) {
    const habits = await this.habitsService.findAll(user.sub);
    return createSuccessResponse(habits, 'Habits retrieved successfully');
  }

  @Get('streaks')
  @ApiOperation({ summary: 'Get all habit streaks' })
  @ApiResponse({ status: 200, description: 'Streaks retrieved successfully' })
  async getStreaks(@CurrentUser() user: JwtPayload) {
    const streaks = await this.habitsService.getStreaks(user.sub);
    return createSuccessResponse(streaks, 'Streaks retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get habit by ID' })
  @ApiResponse({ status: 200, description: 'Habit retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') habitId: string,
  ) {
    const habit = await this.habitsService.findOne(user.sub, habitId);
    return createSuccessResponse(habit, 'Habit retrieved successfully');
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get habit completion history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(
    @CurrentUser() user: JwtPayload,
    @Param('id') habitId: string,
    @Query() query: HabitHistoryDto,
  ) {
    const history = await this.habitsService.getHistory(
      user.sub,
      habitId,
      query.startDate,
      query.endDate,
    );
    return createSuccessResponse(history, 'History retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    const habit = await this.habitsService.create(user.sub, createHabitDto);
    return createSuccessResponse(habit, 'Habit created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiResponse({ status: 200, description: 'Habit updated successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') habitId: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    const habit = await this.habitsService.update(user.sub, habitId, updateHabitDto);
    return createSuccessResponse(habit, 'Habit updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiResponse({ status: 200, description: 'Habit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') habitId: string,
  ) {
    await this.habitsService.remove(user.sub, habitId);
    return createSuccessResponse(null, 'Habit deleted successfully');
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Toggle habit completion for a date' })
  @ApiResponse({ status: 200, description: 'Habit toggled successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async toggleCompletion(
    @CurrentUser() user: JwtPayload,
    @Param('id') habitId: string,
    @Body() dto: ToggleHabitDto,
  ) {
    const result = await this.habitsService.toggleCompletion(
      user.sub,
      habitId,
      dto.date,
    );
    return createSuccessResponse(result, 'Habit toggled successfully');
  }
}
