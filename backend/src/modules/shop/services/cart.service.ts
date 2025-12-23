import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from '../dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  // Get user's cart
  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const cartItems = items.map((item) => this.formatCartItem(item));
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    return {
      items: cartItems,
      itemCount: items.length,
      subtotal,
    };
  }

  // Add item to cart
  async addToCart(userId: string, dto: AddToCartDto) {
    // Verify variant exists and has stock
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
      include: { product: true },
    });

    if (!variant || !variant.isActive || !variant.product.isActive) {
      throw new NotFoundException('Product variant not found');
    }

    if (variant.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already in cart
    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_variantId: { userId, variantId: dto.variantId },
      },
    });

    let item;
    if (existing) {
      const newQuantity = existing.quantity + dto.quantity;
      if (variant.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      item = await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: {
          variant: {
            include: { product: true },
          },
        },
      });
    } else {
      item = await this.prisma.cartItem.create({
        data: {
          userId,
          variantId: dto.variantId,
          quantity: dto.quantity,
        },
        include: {
          variant: {
            include: { product: true },
          },
        },
      });
    }

    this.logger.log(`User ${userId} added ${dto.quantity} of variant ${dto.variantId} to cart`);

    return this.formatCartItem(item);
  }

  // Update cart item quantity
  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { variant: true },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    // If quantity is 0, remove the item
    if (dto.quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
      return { removed: true };
    }

    // Check stock
    if (item.variant.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const updated = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    return this.formatCartItem(updated);
  }

  // Remove item from cart
  async removeFromCart(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    this.logger.log(`User ${userId} removed item ${itemId} from cart`);

    return { removed: true };
  }

  // Clear cart
  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return { cleared: true };
  }

  // Validate cart (check stock before checkout)
  async validateCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { variant: true },
    });

    const issues: string[] = [];

    for (const item of items) {
      if (!item.variant.isActive) {
        issues.push(`${item.variant.name} is no longer available`);
      } else if (item.variant.stock < item.quantity) {
        issues.push(`Only ${item.variant.stock} of ${item.variant.name} available`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  private formatCartItem(item: any) {
    const price = (item.variant.priceCents || item.variant.product.priceCents) / 100;
    return {
      id: item.id,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        image: item.variant.product.images?.[0] || null,
      },
      variant: {
        id: item.variant.id,
        name: item.variant.name,
        attributes: item.variant.attributes,
      },
      price,
      quantity: item.quantity,
      total: price * item.quantity,
      inStock: item.variant.stock >= item.quantity,
      availableStock: item.variant.stock,
    };
  }
}
