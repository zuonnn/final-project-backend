import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductsRepository } from 'src/modules/products/repositories/product.repository';
import { InventoriesModule } from '../inventories/inventories.module';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    { provide: 'ProductsRepositoryInterface', useClass: ProductsRepository}
  ],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    InventoriesModule
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
