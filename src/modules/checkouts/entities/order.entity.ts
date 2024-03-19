import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
})
export class Order extends BaseEntity{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	user_id: mongoose.Schema.Types.ObjectId;
	
	@Prop({type: Object, default: {}})
	checkout_info: object;

	@Prop({type: Object, default: {}})
	shipping_info: object;

	@Prop({type: Object, default: {}})
	payment_info: object;

	@Prop({type: Array, required: true})
	products: Array<object>;

	@Prop({type: String, required: true, default: '#0000116032024'})
	tracking_number: string;

	@Prop({type: String, required: true, default: 'pending', enum: ['pending', 'processing', 'completed', 'cancelled']})
	status: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);