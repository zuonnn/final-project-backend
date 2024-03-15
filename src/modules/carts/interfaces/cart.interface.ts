import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Cart } from "../entities/cart.entity";


export interface CartRepositoryInterface extends BaseRepositoryInterface<Cart> {
    addProductToCart({ user_id, product }): Promise<Cart>;
    createUserCart({ user_id, product }): Promise<Cart>;
    removeProductFromCart({ user_id, product }): Promise<Cart>;
    updateProductQuantity({ user_id, product_id, quantity }): Promise<Cart>;
}