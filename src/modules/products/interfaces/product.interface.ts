import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Product } from "../entities/product.entity";

export interface ProductRepositoryInterface extends BaseRepositoryInterface<Product> {
    searchByName(keySearch: string): Promise<Product[]>;
    findAllProduct(options: {
        limit: number,
        sort: string,
        page: number,
        select: string,
        filter: object,
    }): Promise<Product[]>;
}