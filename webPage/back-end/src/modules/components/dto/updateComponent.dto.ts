import { IsEmpty, IsOptional } from "class-validator";
import { IsForbidden } from "../../../core/decorators/IsForbidden.decorator";

export class UpdateComponentDto {
    @IsForbidden()
    readonly uuid: string

    @IsOptional()
    readonly name: string;

    @IsForbidden()
    readonly data: {date: Date, temperature: number, humidity: number}[]
}