import { Component } from './component.entity';
import { CreateComponentDto } from './dto/createComponent.dto';
import { UpdateComponentDto } from './dto/updateComponent.dto';
export declare class ComponentsService {
    private readonly componentRepository;
    constructor(componentRepository: typeof Component);
    create(createComponentDto: CreateComponentDto, userId: number): Promise<Component>;
    findOneByUuid(uuid: string): Promise<Component>;
    update(uuid: string, updateComponentDto: UpdateComponentDto): Promise<Component>;
    newData(uuid: string, newData: {
        date: Date;
        temperature: number;
        humidity: number;
    }): Promise<Component>;
    deleteById(uuid: string): Promise<number>;
}
