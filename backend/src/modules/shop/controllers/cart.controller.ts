import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { AddToCartDto, UpdateCartItemDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('shop')
@Controller('shop/cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@CurrentUser() user: JwtPayload) {
    const cart = await this.cartService.getCart(user.sub);
    return createSuccessResponse(cart, 'Cart retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async addToCart(
    @CurrentUser() user: JwtPayload,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const item = await this.cartService.addToCart(user.sub, addToCartDto);
    return createSuccessResponse(item, 'Item added to cart');
  }

  @Put(':itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateCartItem(
    @CurrentUser() user: JwtPayload,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const result = await this.cartService.updateCartItem(user.sub, itemId, updateCartItemDto);
    return createSuccessResponse(result, 'Cart item updated');
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeFromCart(
    @CurrentUser() user: JwtPayload,
    @Param('itemId') itemId: string,
  ) {
    const result = await this.cartService.removeFromCart(user.sub, itemId);
    return createSuccessResponse(result, 'Item removed from cart');
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  async clearCart(@CurrentUser() user: JwtPayload) {
    const result = await this.cartService.clearCart(user.sub);
    return createSuccessResponse(result, 'Cart cleared');
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate cart before checkout' })
  @ApiResponse({ status: 200, description: 'Cart validation result' })
  async validateCart(@CurrentUser() user: JwtPayload) {
    const result = await this.cartService.validateCart(user.sub);
    return createSuccessResponse(result, 'Cart validated');
  }
}
