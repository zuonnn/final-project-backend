import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    comment_product_id: string;

    @IsNotEmpty()
    @IsString()
    comment_user_id: string;

    @IsNotEmpty()
    @IsString()
    comment_content: string;

    @IsOptional()
    @IsString()
    comment_parent_id: string;
}
