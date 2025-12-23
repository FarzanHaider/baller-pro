import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, CreateVariantDto, ProductFilterDto } from '../dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  // Get all products with filters
  async findAll(filters: ProductFilterDto) {
    const { categoryId, search, featured, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: products.map((p) => this.formatProduct(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single product
  async findOne(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  // Create product (admin)
  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        categoryId: dto.categoryId,
        priceCents: dto.priceCents,
        compareAtPrice: dto.compareAtPrice,
        images: dto.images || [],
        isFeatured: dto.isFeatured || false,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    this.logger.log(`Product created: ${product.id}`);

    return this.formatProduct(product);
  }

  // Add variant to product (admin)
  async addVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        name: dto.name,
        sku: dto.sku,
        priceCents: dto.priceCents,
        stock: dto.stock,
        attributes: dto.attributes || {},
      },
    });

    return {
      id: variant.id,
      name: variant.name,
      sku: variant.sku,
      price: (variant.priceCents || product.priceCents) / 100,
      stock: variant.stock,
      attributes: variant.attributes,
      inStock: variant.stock > 0,
    };
  }

  // Update variant stock (admin)
  async updateStock(variantId: string, stock: number) {
    const variant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
    });

    return {
      id: variant.id,
      stock: variant.stock,
      inStock: variant.stock > 0,
    };
  }

  // Get categories
  async getCategories() {
    const categories = await this.prisma.productCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
  }

  // Get featured products
  async getFeatured(limit = 10) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return products.map((p) => this.formatProduct(p));
  }

  private formatProduct(product: any) {
    const minPrice = product.variants?.length > 0
      ? Math.min(
          ...product.variants.map((v: any) => v.priceCents || product.priceCents),
        )
      : product.priceCents;

    const inStock = product.variants?.some((v: any) => v.stock > 0) ?? true;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.priceCents / 100,
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null,
      minPrice: minPrice / 100,
      images: product.images,
      category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: (v.priceCents || product.priceCents) / 100,
        stock: v.stock,
        attributes: v.attributes,
        inStock: v.stock > 0,
      })) || [],
      isFeatured: product.isFeatured,
      inStock,
    };
  }
}
