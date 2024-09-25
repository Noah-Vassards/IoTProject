import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateComponentDto {
    @IsNotEmpty()
    readonly uuid: string;

    @IsOptional()
    readonly name: string;

    @IsOptional()
    readonly data: {date: Date, temperature: number, humidity: number}
}