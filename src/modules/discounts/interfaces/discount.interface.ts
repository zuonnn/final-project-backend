import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Discount } from "../entities/discount.entity";


export interface DiscountRepositoryInterface extends BaseRepositoryInterface<Discount> {
    findByIdAndUpdate(id: string, user_id: string): Promise<Discount>;
}