import {
  Controller,
  Get,
  Post,
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
import { RecipesService } from '../services/recipes.service';
import { RecipeFilterDto, CreateRecipeDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('nutrition')
@Controller('nutrition/recipes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recipes with filters' })
  @ApiResponse({ status: 200, description: 'Recipes retrieved successfully' })
  async findAll(@Query() filters: RecipeFilterDto) {
    const result = await this.recipesService.findAll(filters);
    return createSuccessResponse(result, 'Recipes retrieved successfully');
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get available recipe tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  async getTags() {
    const tags = await this.recipesService.getTags();
    return createSuccessResponse(tags, 'Tags retrieved successfully');
  }

  @Get('favorites')
  @ApiOperation({ summary: "Get user's favorite recipes" })
  @ApiResponse({ status: 200, description: 'Favorites retrieved successfully' })
  async getFavorites(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.recipesService.getFavorites(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return createSuccessResponse(result, 'Favorites retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiResponse({ status: 200, description: 'Recipe retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async findOne(@Param('id') recipeId: string) {
    const recipe = await this.recipesService.findOne(recipeId);
    return createSuccessResponse(recipe, 'Recipe retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new recipe (admin)' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully' })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const recipe = await this.recipesService.create(createRecipeDto);
    return createSuccessResponse(recipe, 'Recipe created successfully');
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status for a recipe' })
  @ApiResponse({ status: 200, description: 'Favorite toggled successfully' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async toggleFavorite(
    @CurrentUser() user: JwtPayload,
    @Param('id') recipeId: string,
  ) {
    const result = await this.recipesService.toggleFavorite(user.sub, recipeId);
    return createSuccessResponse(
      result,
      result.isFavorite ? 'Recipe added to favorites' : 'Recipe removed from favorites',
    );
  }

  @Post('check-favorites')
  @ApiOperation({ summary: 'Check if recipes are favorited by user' })
  @ApiResponse({ status: 200, description: 'Favorites checked successfully' })
  async checkFavorites(
    @CurrentUser() user: JwtPayload,
    @Body('recipeIds') recipeIds: string[],
  ) {
    const result = await this.recipesService.checkFavorites(user.sub, recipeIds);
    return createSuccessResponse(result, 'Favorites checked successfully');
  }
}
