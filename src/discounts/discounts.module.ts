import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schemas/discount.schema';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [DiscountsController],
  providers: [DiscountsService],
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),
    ProductsModule
  ]
})
export class DiscountsModule {}
