import { Inject, Injectable } from '@nestjs/common';
import { COMPONENT_REPOSITORY } from 'src/core/constants';
import { Component } from './component.entity';
import { CreateComponentDto } from './dto/createComponent.dto';

@Injectable()
export class ComponentsService {
    constructor(@Inject(COMPONENT_REPOSITORY) private readonly componentRepository: typeof Component) { }

    async deleteById(id: number) {
        return await this.componentRepository.destroy({ where: { id } })
    }

    async create(createComponentDto: CreateComponentDto, userId: number) {
        return await this.componentRepository.create<Component>({...createComponentDto, userId});
    }
}
