import { Alarm } from '../alarms/alarm.entity';
import { AlarmsService } from '../alarms/alarm.service';
import { Component } from '../components/component.entity';
import { ComponentsService } from '../components/components.service';
import { MqttService } from '../mqtt/mqtt.service';
import { TokenService } from '../token/token.service';
import { UserDto } from './dto/user.dto';
import { User } from './users.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly tokenService;
    private readonly componentService;
    private readonly alarmService;
    private readonly mqttService;
    constructor(userRepository: typeof User, tokenService: TokenService, componentService: ComponentsService, alarmService: AlarmsService, mqttService: MqttService);
    create(user: UserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(id: number): Promise<User>;
    registerComponent(id: number, uuid: string): Promise<User>;
    findAllComponents(id: number): Promise<Component[]>;
    registerAlarm(id: number, uuid: string): Promise<User>;
    findAllAlarms(id: number): Promise<Alarm[]>;
    delete(email: string): Promise<number>;
    deleteAll(): Promise<number>;
}
