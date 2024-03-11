import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Role } from '../enums/role.enum';
import { BaseEntity } from 'src/base/entities/base.entity';
import { Address, AddressSchema } from './address.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
    toJSON: {
        getters: true,
    }
})
export class User extends BaseEntity{
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop({
		match: /^([+]\d{2})?\d{10}$/,
		get: (phone_number: string) => {
			if (!phone_number) {
				return;
			}
			const last_three_digits = phone_number.slice(phone_number.length - 4);
			return `****-***-${last_three_digits}`;
		},
	})
    phone_number: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ default: false })
    is_verified: boolean;

    @Prop({ default: "inactive"})
    status: string;

    @Prop()
    roles: Role[];

    @Prop({
        type: AddressSchema,
    })
    address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
