import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Transform } from 'class-transformer';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Transform((value) => value.toString())
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    thumbnail: string;

    @Prop()
    description: string;

    @Prop()
    slug: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true, enum: ['electronics', 'clothing'] })
    type: string;

    @Prop({ type: Object })
    attributes: { [key: string]: any };

    @Prop({
        default: 4.5, 
        min: [1, 'Rating must be above 1.0'], 
        max: [5, 'Rating must be below 5.0'],
        set: (value: number) => Math.round(value * 10) / 10
    })
    rating: number;

    @Prop()
    variations: { [key: string]: any }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);