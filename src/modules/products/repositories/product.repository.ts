import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductRepositoryInterface } from 'src/modules/products/interfaces/product.interface';

@Injectable()
export class ProductsRepository
    extends BaseRepositoryAbstract<Product>
    implements ProductRepositoryInterface {
    constructor(
        @InjectModel(Product.name)
        private readonly products_repository: Model<Product>,
    ) {
        super(products_repository);
    }

    async findAllProduct({ limit, sort, page, filter, select }): Promise<Product[]> {
        const skip = (page - 1) * limit;
        const sortBy: string | { [key: string]: SortOrder | { $meta: any } } = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
        const products = await this.products_repository.find(filter)
            .sort(sortBy)
            .limit(limit)
            .skip(skip)
            .select(select);
        return products;
    }

    async searchByName(name: string): Promise<Product[]> {
        const products = await this.products_repository.find({ name: new RegExp(name, 'i') });
        return products;
    }
}
