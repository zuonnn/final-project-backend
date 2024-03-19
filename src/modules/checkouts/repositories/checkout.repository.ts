import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Order } from 'src/modules/checkouts/entities/order.entity';
import { CheckoutRepositoryInterface } from 'src/modules/checkouts/interfaces/checkout.interface';

@Injectable()
export class CheckoutsRepository
  extends BaseRepositoryAbstract<Order>
  implements CheckoutRepositoryInterface {
  constructor(
    @InjectModel(Order.name)
    private readonly checkoutModel: Model<Order>,
  ) {
    super(checkoutModel);
  }
}
