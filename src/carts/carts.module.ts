import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule
  ],
  exports: [CartsService],
})
export class CartsModule {}
