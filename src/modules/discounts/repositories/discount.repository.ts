import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Discount } from 'src/modules/discounts/entities/discount.entity';
import { DiscountRepositoryInterface } from 'src/modules/discounts/interfaces/discount.interface';

@Injectable()
export class DiscountsRepository
    extends BaseRepositoryAbstract<Discount>
    implements DiscountRepositoryInterface {
    constructor(
        @InjectModel(Discount.name)
        private readonly discountModel: Model<Discount>,
    ) {
        super(discountModel);
    }
    async findByIdAndUpdate(id: string, user_id: string): Promise<Discount> {
        return await this.discountModel.findByIdAndUpdate(id, {
            $pull: {
                used_users: user_id
            },
            $inc: {
                max_usage: 1,
                used_count: -1
            }
        });
    }
}
