import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ALARM_REPOSITORY } from 'src/core/constants';
import { Alarm } from './alarm.entity';
import { CreateAlarmDto } from './dto/createAlarm.dto';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';
import { Component } from '../components/component.entity';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class AlarmsService {
    constructor(
        @Inject(ALARM_REPOSITORY) private readonly alarmRepository: typeof Alarm,
        private readonly mqttService: MqttService
    ) { }

    async create(createAlarmDto: CreateAlarmDto, userId: number) {
        return await this.alarmRepository.create<Alarm>({ ...createAlarmDto, userId });
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
        const alarm = await this.alarmRepository.findOne({ where: { uuid } })
        
        if (!alarm) {
            throw new BadRequestException('Alarm not found')
        }
        const date = new Date()
        date.setDate(date.getDate() - 872)
        alarm.disabledUntil = date
        
        if (alarm.disabledUntil && alarm.disabledUntil.getTime() < Date.now()) {
            console.log(activation ? 'activation' : 'deactivation')
            alarm.activated = activation
        }
        return await alarm.save()
    }

    async forceDeactivation(uuid: string) {
        console.log('force deactivation')
        const alarm = await this.alarmRepository.findOne({ where: { uuid } })

        if (!alarm) {
            throw new BadRequestException('Alarm not found')
        }
        this.mqttService.publish(`/deactivate/${alarm.uuid}`, "")
        alarm.activated = false
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() + 1)
        alarm.disabledUntil = currentDate
        return await alarm.save()
    }

    async deleteById(uuid: string) {
        return await this.alarmRepository.destroy({ where: { uuid } })
    }
}
