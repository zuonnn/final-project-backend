import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    slug: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
    @IsNotEmpty()
    @IsString()
    type: 'electronics' | 'clothing';
    
    @IsOptional()
    attribute: { [key: string]: any }[];
}
