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
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, ShippingAddressDto, UpdateOrderStatusDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('shop')
@Controller('shop')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Orders
  @Post('checkout')
  @ApiOperation({ summary: 'Create order from cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Cart empty or validation failed' })
  async checkout(
    @CurrentUser() user: JwtPayload,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.ordersService.createOrder(user.sub, createOrderDto);
    return createSuccessResponse(order, 'Order created successfully');
  }

  @Get('orders')
  @ApiOperation({ summary: "Get user's orders" })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getUserOrders(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.ordersService.getUserOrders(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
    return createSuccessResponse(result, 'Orders retrieved successfully');
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id') orderId: string,
  ) {
    const order = await this.ordersService.getOrder(user.sub, orderId);
    return createSuccessResponse(order, 'Order retrieved successfully');
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Update order status (admin)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(orderId, updateStatusDto);
    return createSuccessResponse(order, 'Order status updated');
  }

  // Shipping Addresses
  @Get('addresses')
  @ApiOperation({ summary: 'Get shipping addresses' })
  @ApiResponse({ status: 200, description: 'Addresses retrieved successfully' })
  async getAddresses(@CurrentUser() user: JwtPayload) {
    const addresses = await this.ordersService.getAddresses(user.sub);
    return createSuccessResponse(addresses, 'Addresses retrieved successfully');
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Create shipping address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async createAddress(
    @CurrentUser() user: JwtPayload,
    @Body() addressDto: ShippingAddressDto,
  ) {
    const address = await this.ordersService.createAddress(user.sub, addressDto);
    return createSuccessResponse(address, 'Address created successfully');
  }

  @Put('addresses/:id')
  @ApiOperation({ summary: 'Update shipping address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @CurrentUser() user: JwtPayload,
    @Param('id') addressId: string,
    @Body() addressDto: ShippingAddressDto,
  ) {
    const address = await this.ordersService.updateAddress(user.sub, addressId, addressDto);
    return createSuccessResponse(address, 'Address updated successfully');
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete shipping address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(
    @CurrentUser() user: JwtPayload,
    @Param('id') addressId: string,
  ) {
    const result = await this.ordersService.deleteAddress(user.sub, addressId);
    return createSuccessResponse(result, 'Address deleted successfully');
  }
}
