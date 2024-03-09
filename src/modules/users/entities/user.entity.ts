import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Role } from '../enums/role.enum';
import { BaseEntity } from 'src/modules/shared/base.entity';
import { Address, AddressSchema } from './address.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseEntity{
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, match: /^([+]\d{2})?\d{10}$/ })
    phone: string;

    @Prop({ required: true, select: false})
    password: string;

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
