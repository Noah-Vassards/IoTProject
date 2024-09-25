import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAlarmDto {
    @IsNotEmpty()
    readonly uuid: string;

    @IsOptional()
    readonly name: string;

    @IsOptional()
    readonly activated: boolean
}