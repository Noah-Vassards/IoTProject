import { AlarmsService } from './alarm.service';
import { UpdateAlarmDto } from './dto/updateAlarm.dto';
export declare class AlarmsController {
    private alarmsService;
    constructor(alarmsService: AlarmsService);
    findOneByUuid(uuid: string): Promise<import("./alarm.entity").Alarm>;
    findAll(): Promise<import("./alarm.entity").Alarm[]>;
    update(uuid: string, updateAlarmDto: UpdateAlarmDto): Promise<import("./alarm.entity").Alarm>;
    activate(uuid: string, activation: string): Promise<import("./alarm.entity").Alarm>;
    forceDeactivation(uuid: string): Promise<import("./alarm.entity").Alarm>;
    deleteByUuid(uuid: string): Promise<number>;
}
