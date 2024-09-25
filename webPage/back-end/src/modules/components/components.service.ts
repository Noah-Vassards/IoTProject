import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { COMPONENT_REPOSITORY } from 'src/core/constants';
import { Component } from './component.entity';
import { CreateComponentDto } from './dto/createComponent.dto';
import { UpdateComponentDto } from './dto/updateComponent.dto';

@Injectable()
export class ComponentsService {
    constructor(@Inject(COMPONENT_REPOSITORY) private readonly componentRepository: typeof Component) { }

    async create(createComponentDto: CreateComponentDto, userId: number) {
        const { data, ...componentDto } = createComponentDto
        return await this.componentRepository.create<Component>({ ...componentDto, data: data ? [data] : [], userId });
    }

    async findOneByUuid(uuid: string) {
        return await this.componentRepository.findOne({ where: { uuid } })
    }

    async update(uuid: string, updateComponentDto: UpdateComponentDto) {
        console.log('here')
        const component = await this.componentRepository.findOne({ where: { uuid } })

        if (!component) {
            console.error('Component not found')
            throw new BadRequestException('Component not found')
        }
        console.log(updateComponentDto)
        await component.update(updateComponentDto)
        return await component.save()
    }

    async newData(uuid: string, newData: { date: Date, temperature: number, humidity: number }) {
        const component = await this.componentRepository.findOne({ where: { uuid } })

        if (!component) {
            throw new BadRequestException('Component not found')
        }

        component.data = [...component.data, newData]
        return await component.save()
    }

    async deleteById(uuid: string) {
        return await this.componentRepository.destroy({ where: { uuid } })
    }
}
