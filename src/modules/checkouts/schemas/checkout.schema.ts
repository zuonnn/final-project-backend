import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type CheckoutDocument = HydratedDocument<Checkout>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
})
export class Checkout extends BaseEntity{
    
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);