import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

export type KeyTokenDocument = HydratedDocument<KeyToken>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
})
export class KeyToken extends BaseEntity{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({type: String, required: true})
    privateKey: string;

    @Prop({type: String, required: true})
    publicKey: string;

    @Prop({type: Array, default: []})
    refresh_token_used: string[];

    @Prop({type: String, required: true})
    refresh_token: string;
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);
