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
import { MealsService } from '../services/meals.service';
import { LogMealDto, UpdateMealDto, MealFilterDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('nutrition')
@Controller('nutrition/meals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @ApiOperation({ summary: 'Get meals for a date (defaults to today)' })
  @ApiResponse({ status: 200, description: 'Meals retrieved successfully' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() filters: MealFilterDto,
  ) {
    const result = await this.mealsService.findAll(user.sub, filters);
    return createSuccessResponse(result, 'Meals retrieved successfully');
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get nutrition summary for a date range' })
  @ApiResponse({ status: 200, description: 'Summary retrieved successfully' })
  async getSummary(
    @CurrentUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const summary = await this.mealsService.getSummary(user.sub, startDate, endDate);
    return createSuccessResponse(summary, 'Summary retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Log a meal' })
  @ApiResponse({ status: 201, description: 'Meal logged successfully' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() logMealDto: LogMealDto,
  ) {
    const meal = await this.mealsService.create(user.sub, logMealDto);
    return createSuccessResponse(meal, 'Meal logged successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a meal' })
  @ApiResponse({ status: 200, description: 'Meal updated successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') mealId: string,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    const meal = await this.mealsService.update(user.sub, mealId, updateMealDto);
    return createSuccessResponse(meal, 'Meal updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal' })
  @ApiResponse({ status: 200, description: 'Meal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') mealId: string,
  ) {
    await this.mealsService.remove(user.sub, mealId);
    return createSuccessResponse(null, 'Meal deleted successfully');
  }
}
