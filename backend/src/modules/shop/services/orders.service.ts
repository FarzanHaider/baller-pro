import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, ShippingAddressDto, UpdateOrderStatusDto, OrderStatusEnum } from '../dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  // Create order from cart
  async createOrder(userId: string, dto: CreateOrderDto) {
    // Get cart items
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify shipping address
    const address = await this.prisma.shippingAddress.findFirst({
      where: { id: dto.shippingAddressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${item.variant.name}`);
      }
    }

    // Calculate totals
    let subtotalCents = 0;
    const orderItems: any[] = [];

    for (const item of cartItems) {
      const priceCents = item.variant.priceCents || item.variant.product.priceCents;
      subtotalCents += priceCents * item.quantity;
      orderItems.push({
        variantId: item.variant.id,
        quantity: item.quantity,
        priceCents,
        name: `${item.variant.product.name} - ${item.variant.name}`,
      });
    }

    // For now, no shipping or tax calculation
    const shippingCents = 0;
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: 'PROCESSING',
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          shippingAddressId: address.id,
          paymentProvider: dto.paymentProvider,
          paymentId: dto.paymentId,
          notes: dto.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
          shippingAddress: true,
        },
      });

      // Reduce stock
      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    this.logger.log(`Order ${order.orderNumber} created for user ${userId}`);

    return this.formatOrder(order);
  }

  // Get user's orders
  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      items: orders.map((o) => this.formatOrder(o)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single order
  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrder(order);
  }

  // Update order status (admin)
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status,
        trackingNumber: dto.trackingNumber,
        trackingUrl: dto.trackingUrl,
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        shippingAddress: true,
      },
    });

    this.logger.log(`Order ${orderId} status updated to ${dto.status}`);

    return this.formatOrder(updated);
  }

  // Shipping addresses
  async getAddresses(userId: string) {
    const addresses = await this.prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return addresses.map((a) => this.formatAddress(a));
  }

  async createAddress(userId: string, dto: ShippingAddressDto) {
    // If setting as default, unset other defaults
    if (dto.isDefault) {
      await this.prisma.shippingAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.shippingAddress.create({
      data: {
        userId,
        name: dto.name,
        address1: dto.address1,
        address2: dto.address2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country,
        phone: dto.phone,
        isDefault: dto.isDefault || false,
      },
    });

    return this.formatAddress(address);
  }

  async updateAddress(userId: string, addressId: string, dto: ShippingAddressDto) {
    const existing = await this.prisma.shippingAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    if (dto.isDefault) {
      await this.prisma.shippingAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.shippingAddress.update({
      where: { id: addressId },
      data: dto,
    });

    return this.formatAddress(address);
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.prisma.shippingAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.shippingAddress.delete({ where: { id: addressId } });

    return { deleted: true };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BP-${timestamp}-${random}`;
  }

  private formatOrder(order: any) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.subtotalCents / 100,
      shipping: order.shippingCents / 100,
      tax: order.taxCents / 100,
      total: order.totalCents / 100,
      items: order.items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.priceCents / 100,
        product: item.variant?.product
          ? {
              id: item.variant.product.id,
              image: item.variant.product.images?.[0] || null,
            }
          : null,
      })) || [],
      shippingAddress: order.shippingAddress
        ? this.formatAddress(order.shippingAddress)
        : null,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      createdAt: order.createdAt.toISOString(),
    };
  }

  private formatAddress(address: any) {
    return {
      id: address.id,
      name: address.name,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    };
  }
}
