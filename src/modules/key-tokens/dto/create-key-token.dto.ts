import { IsNotEmpty, IsString } from "class-validator";

export class CreateKeyTokenDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    publicKey: string;

    @IsNotEmpty()
    @IsString()
    privateKey: string;

    @IsNotEmpty()
    @IsString()
    refresh_token: string;
}
