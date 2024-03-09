import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';

export type CheckoutDocument = HydratedDocument<Checkout>;

@Schema({ timestamps: true })
export class Checkout {
    
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);