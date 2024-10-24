import { MqttService } from '../mqtt/mqtt.service';
import { Alarm } from './alarm.entity';
import { CreateAlarmDto } from './dto/createAlarm.dto';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class AlarmsService {
    private readonly alarmRepository;
    private readonly mqttService;
    private readonly eventEmitter;
    constructor(alarmRepository: typeof Alarm, mqttService: MqttService, eventEmitter: EventEmitter2);
    create(createAlarmDto: CreateAlarmDto, userId: number): Promise<Alarm>;
    findOneByUuid(uuid: string): Promise<Alarm>;
    findAll(): Promise<Alarm[]>;
    update(uuid: string, updateAlarmDto: UpdateAlarmDto): Promise<Alarm>;
    activate(uuid: string, activation: boolean): Promise<Alarm>;
    forceDeactivation(uuid: string): Promise<Alarm>;
    deleteById(uuid: string): Promise<number>;
}
