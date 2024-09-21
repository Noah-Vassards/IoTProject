import { Controller, Delete, Param } from '@nestjs/common';
import { ComponentsService } from './components.service';

@Controller('components')
export class ComponentsController {
    constructor(private componentService: ComponentsService) {}

    @Delete(':id')
    async deleteById(@Param('id') id: number) {
        return this.componentService.deleteById(id);
    }
}
