import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AlarmsService } from './alarm.service';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';

@Controller('alarms')
export class AlarmsController {
    constructor(private alarmsService: AlarmsService) {}

    @Get(':uuid')
    async findOneByUuid(@Param('uuid') uuid: string) {
        return await this.alarmsService.findOneByUuid(uuid)
    }

    @Get()
    async findAll() {
        return await this.alarmsService.findAll()
    }
    
    @Patch(':uuid')
    async update(@Param('uuid') uuid: string, @Body() updateAlarmDto: UpdateAlarmDto) {
        return await this.alarmsService.update(uuid, updateAlarmDto)
    }
    
    @Patch(':uuid/activate/:activation')
    async activate(@Param('uuid') uuid: string, @Param('activation') activation: boolean) {
        return await this.alarmsService.activate(uuid, activation)
    }

    @Delete(':uuid')
    async deleteByUuid(@Param('uuid') uuid: string) {
        return await this.alarmsService.deleteById(uuid);
    }
}