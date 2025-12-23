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
import { ProductsService } from '../services/products.service';
import { CreateProductDto, CreateVariantDto, ProductFilterDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('shop')
@Controller('shop/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() filters: ProductFilterDto) {
    const result = await this.productsService.findAll(filters);
    return createSuccessResponse(result, 'Products retrieved successfully');
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully' })
  async getFeatured(@Query('limit') limit?: number) {
    const products = await this.productsService.getFeatured(limit ? Number(limit) : 10);
    return createSuccessResponse(products, 'Featured products retrieved successfully');
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get product categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    const categories = await this.productsService.getCategories();
    return createSuccessResponse(categories, 'Categories retrieved successfully');
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') productId: string) {
    const product = await this.productsService.findOne(productId);
    return createSuccessResponse(product, 'Product retrieved successfully');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (admin)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return createSuccessResponse(product, 'Product created successfully');
  }

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add variant to product (admin)' })
  @ApiResponse({ status: 201, description: 'Variant added successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addVariant(
    @Param('id') productId: string,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    const variant = await this.productsService.addVariant(productId, createVariantDto);
    return createSuccessResponse(variant, 'Variant added successfully');
  }
}
