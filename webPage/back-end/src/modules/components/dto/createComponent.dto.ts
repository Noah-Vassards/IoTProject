import { IsNotEmpty } from "class-validator";

export class CreateComponentDto {
    @IsNotEmpty()
    readonly uuid: string;

    readonly name: string;

    readonly temperature: number;

    readonly humidity: number;

    readonly temperatureRange: number[];

    readonly humidityRange: number[];
}