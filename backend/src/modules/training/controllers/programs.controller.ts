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
import { ProgramsService } from '../services/programs.service';
import {
  CreateProgramDto,
  UpdateProgramDto,
  ProgramFilterDto,
  EnrollProgramDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../common/dto/api-response.dto';

@ApiTags('training')
@Controller('training/programs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @ApiOperation({ summary: 'List all programs with optional filters' })
  @ApiResponse({ status: 200, description: 'Programs retrieved successfully' })
  async findAll(@Query() filters: ProgramFilterDto) {
    const result = await this.programsService.findAll(filters);
    return createPaginatedResponse(
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Programs retrieved successfully',
    );
  }

  @Get('enrolled')
  @ApiOperation({ summary: 'Get programs user is enrolled in' })
  @ApiResponse({ status: 200, description: 'Enrolled programs retrieved' })
  async getUserPrograms(@CurrentUser() user: JwtPayload) {
    const programs = await this.programsService.getUserPrograms(user.sub);
    return createSuccessResponse(programs, 'Enrolled programs retrieved');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID with weeks and workouts' })
  @ApiResponse({ status: 200, description: 'Program retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  async findOne(@Param('id') id: string) {
    const program = await this.programsService.findOne(id);
    return createSuccessResponse(program, 'Program retrieved successfully');
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get user progress in a program' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Not enrolled in program' })
  async getProgress(
    @CurrentUser() user: JwtPayload,
    @Param('id') programId: string,
  ) {
    const progress = await this.programsService.getProgress(user.sub, programId);
    return createSuccessResponse(progress, 'Progress retrieved successfully');
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new program (Admin only)' })
  @ApiResponse({ status: 201, description: 'Program created successfully' })
  async create(@Body() createProgramDto: CreateProgramDto) {
    const program = await this.programsService.create(createProgramDto);
    return createSuccessResponse(program, 'Program created successfully');
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a program (Admin only)' })
  @ApiResponse({ status: 200, description: 'Program updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    const program = await this.programsService.update(id, updateProgramDto);
    return createSuccessResponse(program, 'Program updated successfully');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a program (Admin only)' })
  @ApiResponse({ status: 200, description: 'Program deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.programsService.remove(id);
    return createSuccessResponse(null, 'Program deleted successfully');
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll in a program' })
  @ApiResponse({ status: 201, description: 'Enrolled successfully' })
  @ApiResponse({ status: 400, description: 'Already enrolled' })
  async enroll(
    @CurrentUser() user: JwtPayload,
    @Param('id') programId: string,
    @Body() dto: EnrollProgramDto,
  ) {
    const enrollment = await this.programsService.enroll(
      user.sub,
      programId,
      dto,
    );
    return createSuccessResponse(enrollment, 'Enrolled successfully');
  }

  @Post(':id/advance')
  @ApiOperation({ summary: 'Advance to next workout in program' })
  @ApiResponse({ status: 200, description: 'Progress advanced' })
  async advanceProgress(
    @CurrentUser() user: JwtPayload,
    @Param('id') programId: string,
  ) {
    const progress = await this.programsService.advanceProgress(
      user.sub,
      programId,
    );
    return createSuccessResponse(progress, 'Progress advanced');
  }
}
