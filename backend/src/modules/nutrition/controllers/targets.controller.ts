import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TargetsService } from '../services/targets.service';
import { SetNutritionTargetDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('nutrition')
@Controller('nutrition/targets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user nutrition targets' })
  @ApiResponse({ status: 200, description: 'Targets retrieved successfully' })
  async getTargets(@CurrentUser() user: JwtPayload) {
    const targets = await this.targetsService.getTargets(user.sub);
    return createSuccessResponse(targets, 'Targets retrieved successfully');
  }

  @Put()
  @ApiOperation({ summary: 'Set user nutrition targets' })
  @ApiResponse({ status: 200, description: 'Targets updated successfully' })
  async setTargets(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SetNutritionTargetDto,
  ) {
    const targets = await this.targetsService.setTargets(user.sub, dto);
    return createSuccessResponse(targets, 'Targets updated successfully');
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate targets based on user profile' })
  @ApiResponse({ status: 200, description: 'Targets calculated successfully' })
  async calculateTargets(@CurrentUser() user: JwtPayload) {
    const targets = await this.targetsService.calculateTargets(user.sub);
    return createSuccessResponse(targets, 'Targets calculated successfully');
  }

  @Get('progress')
  @ApiOperation({ summary: "Get today's progress against targets" })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  async getTodayProgress(@CurrentUser() user: JwtPayload) {
    const progress = await this.targetsService.getTodayProgress(user.sub);
    return createSuccessResponse(progress, 'Progress retrieved successfully');
  }
}
