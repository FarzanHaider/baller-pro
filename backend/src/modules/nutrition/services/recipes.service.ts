import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RecipeFilterDto, CreateRecipeDto } from '../dto';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(private prisma: PrismaService) {}

  // Get all recipes with filters
  async findAll(filters: RecipeFilterDto) {
    const { search, tags, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      items: recipes.map((r) => this.formatRecipe(r)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get recipe by ID
  async findOne(recipeId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.formatRecipeDetail(recipe);
  }

  // Create recipe (admin)
  async create(createRecipeDto: CreateRecipeDto) {
    const recipe = await this.prisma.recipe.create({
      data: {
        title: createRecipeDto.title,
        description: createRecipeDto.description,
        imageUrl: createRecipeDto.imageUrl,
        calories: createRecipeDto.calories,
        proteinG: createRecipeDto.proteinG,
        carbsG: createRecipeDto.carbsG,
        fatsG: createRecipeDto.fatsG,
        prepTimeMinutes: createRecipeDto.prepTimeMinutes,
        cookTimeMinutes: createRecipeDto.cookTimeMinutes,
        servings: createRecipeDto.servings,
        ingredients: createRecipeDto.ingredients,
        instructions: createRecipeDto.instructions,
        tags: createRecipeDto.tags || [],
      },
    });

    return this.formatRecipeDetail(recipe);
  }

  // Toggle favorite recipe
  async toggleFavorite(userId: string, recipeId: string) {
    // Verify recipe exists
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    // Check if already favorited
    const existing = await this.prisma.userFavoriteRecipe.findUnique({
      where: {
        userId_recipeId: { userId, recipeId },
      },
    });

    let isFavorite: boolean;

    if (existing) {
      await this.prisma.userFavoriteRecipe.delete({
        where: {
          userId_recipeId: { userId, recipeId },
        },
      });
      isFavorite = false;
    } else {
      await this.prisma.userFavoriteRecipe.create({
        data: { userId, recipeId },
      });
      isFavorite = true;
    }

    this.logger.log(
      `User ${userId} ${isFavorite ? 'favorited' : 'unfavorited'} recipe ${recipeId}`,
    );

    return { recipeId, isFavorite };
  }

  // Get user's favorite recipes
  async getFavorites(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.userFavoriteRecipe.findMany({
        where: { userId },
        include: { recipe: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.userFavoriteRecipe.count({ where: { userId } }),
    ]);

    return {
      items: favorites.map((f) => ({
        ...this.formatRecipe(f.recipe),
        isFavorite: true,
        favoritedAt: f.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Check if recipes are favorited by user
  async checkFavorites(userId: string, recipeIds: string[]) {
    const favorites = await this.prisma.userFavoriteRecipe.findMany({
      where: {
        userId,
        recipeId: { in: recipeIds },
      },
      select: { recipeId: true },
    });

    const favoriteSet = new Set(favorites.map((f) => f.recipeId));

    return recipeIds.map((id) => ({
      recipeId: id,
      isFavorite: favoriteSet.has(id),
    }));
  }

  // Get available recipe tags
  async getTags() {
    const recipes = await this.prisma.recipe.findMany({
      where: { isActive: true },
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    for (const recipe of recipes) {
      for (const tag of recipe.tags) {
        tagSet.add(tag);
      }
    }

    return Array.from(tagSet).sort();
  }

  private formatRecipe(recipe: any) {
    return {
      id: recipe.id,
      title: recipe.title,
      image: recipe.imageUrl,
      calories: recipe.calories,
      macros: {
        protein: Number(recipe.proteinG),
        carbs: Number(recipe.carbsG),
        fats: Number(recipe.fatsG),
      },
      prepTime: recipe.prepTimeMinutes,
      cookTime: recipe.cookTimeMinutes,
      totalTime: (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0),
      tags: recipe.tags,
    };
  }

  private formatRecipeDetail(recipe: any) {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.imageUrl,
      calories: recipe.calories,
      macros: {
        protein: Number(recipe.proteinG),
        carbs: Number(recipe.carbsG),
        fats: Number(recipe.fatsG),
      },
      prepTime: recipe.prepTimeMinutes,
      cookTime: recipe.cookTimeMinutes,
      totalTime: (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0),
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      tags: recipe.tags,
    };
  }
}
