import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Product } from 'src/modules/products/entities/product.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

export type KeyTokenDocument = HydratedDocument<Inventory>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
})
export class Inventory extends BaseEntity {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    product_id: Product;

    @Prop({ required: true })
    stock: number;

    @Prop({ type: Array, required: true, default: []})
    reservations?: {cartId: ObjectId, stock: number, created_on: Date}[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);