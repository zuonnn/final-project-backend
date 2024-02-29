import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { Role } from 'src/users/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Transform((value) => value.toString())
    _id: string;

    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: "inactive"})
    status: string;

    @Prop()
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
