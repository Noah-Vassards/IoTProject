import { IsEmail, IsNotEmpty, MinLength, Validate } from "class-validator";
import { IsStrong } from "../../../core/pipes/isStrong.pipes";

export class UserDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Validate(IsStrong)
    @MinLength(8)
    readonly password: string;
}