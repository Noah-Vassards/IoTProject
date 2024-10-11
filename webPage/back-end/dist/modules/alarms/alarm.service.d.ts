import { Alarm } from './alarm.entity';
import { CreateAlarmDto } from './dto/createAlarm.dto';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';
export declare class AlarmsService {
    private readonly alarmRepository;
    constructor(alarmRepository: typeof Alarm);
    create(createAlarmDto: CreateAlarmDto, userId: number): Promise<Alarm>;
    findOneByUuid(uuid: string): Promise<Alarm>;
    findAll(): Promise<Alarm[]>;
    update(uuid: string, updateAlarmDto: UpdateAlarmDto): Promise<Alarm>;
    activate(uuid: string, activation: boolean): Promise<Alarm>;
    forceDeactivation(uuid: string): Promise<Alarm>;
    deleteById(uuid: string): Promise<number>;
}
