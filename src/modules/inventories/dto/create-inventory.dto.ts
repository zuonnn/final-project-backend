import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDto {
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsOptional()
    reservations?: {cartId: string, stock: number, created_on: Date}[];
}
