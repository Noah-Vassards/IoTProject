import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ALARM_REPOSITORY } from 'src/core/constants';
import { Alarm } from './alarm.entity';
import { CreateAlarmDto } from './dto/createAlarm.dto';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';

@Injectable()
export class AlarmsService {
    constructor(@Inject(ALARM_REPOSITORY) private readonly alarmRepository: typeof Alarm) { }

    async create(createAlarmDto: CreateAlarmDto, userId: number) {
        return await this.alarmRepository.create<Alarm>({...createAlarmDto, userId});
    }

    async findOneByUuid(uuid: string) {
        return await this.alarmRepository.findOne({ where: { uuid } })
    }

    async findAll() {
        return await this.alarmRepository.findAll()
    }

    async update(uuid: string, updateAlarmDto: UpdateAlarmDto) {
        const component = await this.alarmRepository.findOne({ where: { uuid } })

        if (!component) {
            console.error('Alarm not found')
            throw new BadRequestException('Alarm not found')
        }
        await component.update(updateAlarmDto)
        return await component.save()
    }

    async activate(uuid: string, activation: boolean) {
        const component = await this.alarmRepository.findOne({ where: { uuid } })

        if (!component) {
            throw new BadRequestException('Alarm not found')
        }

        component.activated = activation
        return await component.save()
    }

    async deleteById(uuid: string) {
        return await this.alarmRepository.destroy({ where: { uuid } })
    }
}
