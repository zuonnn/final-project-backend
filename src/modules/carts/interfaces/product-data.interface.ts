import mongoose from "mongoose";

export interface ProductData {
    product_id: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }