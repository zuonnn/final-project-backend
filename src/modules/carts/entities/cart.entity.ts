import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})
export class Cart extends BaseEntity {
    @Prop({ required: true, default: 'active', enum: ['active', 'completed', 'failed', 'pending'] })
    state: string;

    @Prop({
        type: [{
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number
        }],
        required: true,
        default: [],
        _id: false
    })
    products: { product_id: mongoose.Schema.Types.ObjectId, quantity: number }[];

    @Prop({ required: true, default: 0 })
    count: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Schema.Types.ObjectId;
}

@Schema()
export class ProductData {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, default: 1 })
    quantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);