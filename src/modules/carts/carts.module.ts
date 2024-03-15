import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './entities/cart.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/products.module';
import { InventoriesModule } from '../inventories/inventories.module';
import { CartsRepository } from './repositories/cart.repository';

@Module({
  controllers: [CartsController],
  providers: [
    CartsService,
    { provide: 'CartsRepositoryInterface', useClass: CartsRepository }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
    InventoriesModule
  ],
  exports: [CartsService],
})
export class CartsModule {}
