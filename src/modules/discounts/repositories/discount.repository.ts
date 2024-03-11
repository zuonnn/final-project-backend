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
        private readonly discounts_repository: Model<Discount>,
    ) {
        super(discounts_repository);
    }
    async findByIdAndUpdate(id: string, userId: string): Promise<Discount> {
        return await this.discounts_repository.findByIdAndUpdate(id, {
            $pull: {
                used_users: userId
            },
            $inc: {
                max_usage: 1,
                used_count: -1
            }
        });
    }
}
