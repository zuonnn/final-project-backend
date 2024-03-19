import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Order } from "../entities/order.entity";


export interface CheckoutRepositoryInterface extends BaseRepositoryInterface<Order> {
    
}