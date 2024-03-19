import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Inventory } from "../entities/inventory.entity";

export interface InventoryRepositoryInterface extends BaseRepositoryInterface<Inventory> {
    reservationInventory({ product_id, quantity, cart_id }): Promise<any>
}