import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDiscountDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsOptional()
    @IsNumber()
    maxValue: number;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    start: Date;

    @IsNotEmpty()
    end: Date;

    @IsNotEmpty()
    @IsNumber()
    maxUsage: number;

    @IsNotEmpty()
    @IsNumber()
    maxUsagePerUser: number;

    @IsOptional()
    usedUsers: string[];

    @IsOptional()
    @IsNumber()
    usedCount: number;

    @IsNotEmpty()
    @IsNumber()
    minOrderValue: number;

    @IsOptional()
    isActive: boolean;

    @IsNotEmpty()
    @IsString()
    applyTo: string;

    @IsOptional()
    productIds: string[];
}