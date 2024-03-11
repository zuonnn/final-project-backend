import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateDiscountDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsOptional()
    @IsNumber()
    max_value: number;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    start: Date;

    @IsNotEmpty()
    end: Date;

    @IsNotEmpty()
    @IsNumber()
    max_usage: number;

    @IsNotEmpty()
    @IsNumber()
    max_usage_per_user: number;

    @IsOptional()
    used_users?: {userId: mongoose.Schema.Types.ObjectId, time: number}[];

    @IsOptional()
    @IsNumber()
    used_count: number;

    @IsNotEmpty()
    @IsNumber()
    min_order_value: number;

    @IsOptional()
    is_active: boolean;

    @IsNotEmpty()
    @IsString()
    apply_to: string;

    @IsOptional()
    product_ids: mongoose.Schema.Types.ObjectId[];
}