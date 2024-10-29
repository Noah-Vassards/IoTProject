import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ALARM_REPOSITORY } from 'src/core/constants';
import { MqttService } from '../mqtt/mqtt.service';
import { Alarm } from './alarm.entity';
import { CreateAlarmDto } from './dto/createAlarm.dto';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AlarmsService {
    constructor(
        @Inject(ALARM_REPOSITORY) private readonly alarmRepository: typeof Alarm,
        private readonly mqttService: MqttService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async create(createAlarmDto: CreateAlarmDto, userId: number) {
        const alarm = this.alarmRepository.findOne({ where: { uuid: createAlarmDto.uuid } })

        if (alarm) {
            throw new BadRequestException('Alarm already exists')
        }
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

        const canActivate = alarm.disabledUntil ? alarm.disabledUntil.getTime() < Date.now() : true

        console.log('---------------- > ', canActivate)

        if (canActivate) {
            if (activation && !alarm.activated) {
                this.eventEmitter.emit('notify.activation', { userId: alarm.userId, alarmName: alarm.name })
                const date = new Date()
                alarm.activations = [...alarm.activations, { activatedAt: date, lasted: 0 }]
            } else if (!activation && alarm.activated) {
                const lastActivation = alarm.activations[alarm.activations.length - 1]
                if (lastActivation) {
                    const activatedAt = new Date(lastActivation.activatedAt)
                    const lasted = (Date.now() - activatedAt.getTime()) / 1000

                    lastActivation.lasted = lasted
                    alarm.activations[alarm.activations.length - 1] = lastActivation
                }
            }
        }
        console.log(alarm.activations)
        
        return await alarm.update({ activations: alarm.activations, activated: activation })
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
