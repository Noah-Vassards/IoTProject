import { IsOptional } from "class-validator";
import { IsForbidden } from "../../../core/decorators/IsForbidden.decorator";

export class UpdateAlarmDto {
    @IsForbidden()
    readonly uuid: string
    
    @IsOptional()
    readonly name: string;
    
    @IsOptional()
    readonly temperatureRange: number[];
    
    @IsOptional()
    readonly humidityRange: number[];

    @IsOptional()
    readonly linkedComponent: string;
}