import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { BaseEntity } from "src/base/entities/base.entity";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})
export class Comment extends BaseEntity{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true})
    comment_product_id : string;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    comment_user_id : string;
    @Prop({required: true})
    comment_content : string;
    @Prop({required: true})
    comment_left: number;
    @Prop({required: true})
    comment_right: number;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null})
    comment_parent_id: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);