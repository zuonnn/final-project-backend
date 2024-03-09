import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Transform } from 'class-transformer';

export type KeyTokenDocument = HydratedDocument<KeyToken>;

@Schema({ timestamps: true })
export class KeyToken {
    @Transform((value) => value.toString())
    _id: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({type: String, required: true})
    privateKey: string;

    @Prop({type: String, required: true})
    publicKey: string;

    @Prop({type: Array, default: []})
    refreshTokenUsed: string[];

    @Prop({type: String, required: true})
    refreshToken: string;
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);
