import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';
import { Transform } from 'class-transformer';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
    @Transform((value) => value.toString())
    _id: string;

    @Prop({ required: true, default: 'active', enum: ['active', 'completed', 'failed', 'pending']})
    state: string;

    @Prop({ required: true, default: []})
    products: {productId: string, quantity: number}[];

    @Prop({ required: true, default: 0})
    count : number;

    @Prop({ required: true})
    userId: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);