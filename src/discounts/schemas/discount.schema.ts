import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Transform } from 'class-transformer';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ timestamps: true })
export class Discount {
    @Transform((value) => value.toString())
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: 'fixed_amount', enum: ['fixed_amount', 'percentage'] })
    type: string;

    @Prop({ required: true })
    value: number;

    @Prop({ required: true })
    maxValue: number;

    @Prop({ required: true, unique: true})
    code: string;

    @Prop({ required: true })
    start: Date;

    @Prop({ required: true })
    end: Date;

    @Prop({ required: true })
    maxUsage: number;

    @Prop({ required: true })
    maxUsagePerUser: number;

    @Prop({ default: [] })
    usedUsers: {userId: string, time: number}[];

    @Prop({ default: 0})
    usedCount: number;

    @Prop({ required: true })
    minOrderValue: number;

    @Prop({ default: true})
    isActive: boolean;

    @Prop({ required: true, default: 'all' , enum: ['all', 'specifics']})
    applyTo: string;

    @Prop({default: []})
    productIds: string[];
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);