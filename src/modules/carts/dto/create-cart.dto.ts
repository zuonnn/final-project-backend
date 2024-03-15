import mongoose from "mongoose";
import { ProductData } from "../interfaces/product-data.interface";

export class CartDto {
    product: ProductData
    user_id: mongoose.Types.ObjectId
}
