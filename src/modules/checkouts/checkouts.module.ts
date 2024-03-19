import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { CheckoutsRepository } from './repositories/checkout.repository';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [CheckoutsController],
  providers: [
    CheckoutsService,
    { provide: 'CheckoutsRepositoryInterface', useClass: CheckoutsRepository }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartsModule,
    ProductsModule,
    DiscountsModule,
    RedisModule
  ],
  
})
export class CheckoutsModule { }
