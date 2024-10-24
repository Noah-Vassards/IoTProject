import { IsEmail, IsNotEmpty, IsOptional, MinLength, Validate } from "class-validator";
import { IsStrong } from "../../../core/pipes/isStrong.pipes";
import { Optional } from "@nestjs/common";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsOptional()
    readonly component: string

    @IsOptional()
    readonly alarm: string
}