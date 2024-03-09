import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkout, CheckoutSchema } from './schemas/checkout.schema';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
  imports: [
    MongooseModule.forFeature([{ name: Checkout.name, schema: CheckoutSchema }]),
    CartsModule,
    ProductsModule,
    DiscountsModule
  ],
  
})
export class CheckoutsModule { }
