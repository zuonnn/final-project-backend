import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Checkout } from 'src/modules/checkouts/entities/checkout.entity';
import { CheckoutRepositoryInterface } from 'src/modules/checkouts/interfaces/checkout.interface';

@Injectable()
export class CheckoutsRepository
  extends BaseRepositoryAbstract<Checkout>
  implements CheckoutRepositoryInterface {
  constructor(
    @InjectModel(Checkout.name)
    private readonly checkoutModel: Model<Checkout>,
  ) {
    super(checkoutModel);
  }
}
