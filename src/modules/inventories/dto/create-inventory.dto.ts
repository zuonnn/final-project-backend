import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDto {
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsOptional()
    reservations?: {cart_id: string, stock: number, created_on: Date}[];
}
