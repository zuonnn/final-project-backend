import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { User } from './user.entity';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address extends BaseEntity {
    @Prop({ minlength: 2, maxlength: 120 })
    street?: string;

    @Prop({ required: true, minlength: 2, maxlength: 50 })
    state: string;

    @Prop({ required: true, minlength: 2, maxlength: 50 })
    city: string;

    @Prop({ required: false, minlength: 2, maxlength: 50 })
    postal_code?: number;

    @Prop({ required: true, minlength: 2, maxlength: 50 })
    country: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	user_id: User;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
