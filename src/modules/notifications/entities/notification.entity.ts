import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
})
export class Notification extends BaseEntity {
    //ORDER-001: order success
	//ORDER-002: order failed
	//PROMOTION-001: new promotion
	@Prop({ required: true, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001'] })
	noti_type: string;

	@Prop({ default: 'all', enum: ['all', 'user', 'admin'] })
	noti_receiver: string;

	@Prop({ required: true })
	noti_content: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);