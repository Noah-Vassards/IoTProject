import { IsNotEmpty } from "class-validator";

export class TokenDto {
    @IsNotEmpty()
    readonly access_token: string;

    @IsNotEmpty()
    readonly expiration_date: Date;
}