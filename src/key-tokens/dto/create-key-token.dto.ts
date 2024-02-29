import { IsNotEmpty, IsString } from "class-validator";

export class CreateKeyTokenDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    publicKey: string;

    @IsNotEmpty()
    @IsString()
    privateKey: string;

    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
