import { IsEmail, IsNotEmpty, IsOptional, MinLength, Validate } from "class-validator";
import { IsStrong } from "../../../core/pipes/isStrong.pipes";
import { Optional } from "@nestjs/common";

export class SignUpDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Validate(IsStrong)
    @MinLength(8)
    readonly password: string;

    @IsOptional()
    readonly component: string

    @IsOptional()
    readonly alarm: string
}