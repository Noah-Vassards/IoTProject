import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { UpdateComponentDto } from './dto/updateComponent.dto';

@Controller('components')
export class ComponentsController {
    constructor(private componentService: ComponentsService) {}

    @Get(':uuid')
    async findOneByUuid(@Param('uuid') uuid: string) {
        return await this.componentService.findOneByUuid(uuid)
    }
    
    @Patch(':uuid')
    async update(@Param('uuid') uuid: string, @Body() updateComponentDto: UpdateComponentDto) {
        return await this.componentService.update(uuid, updateComponentDto)
    }
    
    @Post(':uuid/newData')
    async newData(@Param('uuid') uuid: string, @Body() newData: {date: Date, temperature: number, humidity: number}) {
        return await this.componentService.newData(uuid, newData)
    }

    @Delete(':uuid')
    async deleteByUuid(@Param('uuid') uuid: string) {
        return await this.componentService.deleteById(uuid);
    }
}
