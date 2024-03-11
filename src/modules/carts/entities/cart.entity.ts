import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
})
export class Cart extends BaseEntity{
    @Prop({ required: true, default: 'active', enum: ['active', 'completed', 'failed', 'pending']})
    state: string;

    @Prop({ required: true, default: []})
    products: {productId: string, quantity: number, price: number}[];

    @Prop({ required: true, default: 0})
    count : number;

    @Prop({ required: true})
    userId: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);