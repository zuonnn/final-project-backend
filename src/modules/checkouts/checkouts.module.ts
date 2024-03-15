import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkout, CheckoutSchema } from './entities/checkout.entity';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { CheckoutsRepository } from './repositories/checkout.repository';

@Module({
  controllers: [CheckoutsController],
  providers: [
    CheckoutsService,
    { provide: 'CheckoutsRepositoryInterface', useClass: CheckoutsRepository }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Checkout.name, schema: CheckoutSchema }]),
    CartsModule,
    ProductsModule,
    DiscountsModule
  ],
  
})
export class CheckoutsModule { }
