import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './entities/discount.entity';
import { ProductsModule } from '../products/products.module';
import { DiscountsRepository } from './repositories/discount.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [DiscountsController],
  providers: [
    DiscountsService,
    { provide: 'DiscountsRepositoryInterface', useClass: DiscountsRepository }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),
    ProductsModule,
    NotificationsModule
  ],
  exports: [DiscountsService]
})
export class DiscountsModule {}
