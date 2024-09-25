import { ComponentsService } from './components.service';
import { UpdateComponentDto } from './dto/updateComponent.dto';
export declare class ComponentsController {
    private componentService;
    constructor(componentService: ComponentsService);
    findOneByUuid(uuid: string): Promise<import("./component.entity").Component>;
    update(uuid: string, updateComponentDto: UpdateComponentDto): Promise<import("./component.entity").Component>;
    newData(uuid: string, newData: {
        date: Date;
        temperature: number;
        humidity: number;
    }): Promise<import("./component.entity").Component>;
    deleteByUuid(uuid: string): Promise<number>;
}
