import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { CartController } from './controllers/cart.controller';
import { OrdersController } from './controllers/orders.controller';
import { ProductsService } from './services/products.service';
import { CartService } from './services/cart.service';
import { OrdersService } from './services/orders.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController, CartController, OrdersController],
  providers: [ProductsService, CartService, OrdersService],
  exports: [ProductsService, CartService, OrdersService],
})
export class ShopModule {}
