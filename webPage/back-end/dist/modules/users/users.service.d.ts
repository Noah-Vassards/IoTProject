import { TokenService } from '../token/token.service';
import { UserDto } from './dto/user.dto';
import { User } from './users.entity';
import { Component } from '../components/component.entity';
import { CreateComponentDto } from '../components/dto/createComponent.dto';
import { ComponentsService } from '../components/components.service';
import { CreateAlarmDto } from '../alarms/dto/createAlarm.dto';
import { AlarmsService } from '../alarms/alarm.service';
import { Alarm } from '../alarms/alarm.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly tokenService;
    private readonly componentService;
    private readonly alarmService;
    constructor(userRepository: typeof User, tokenService: TokenService, componentService: ComponentsService, alarmService: AlarmsService);
    create(user: UserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(id: number): Promise<User>;
    registerComponent(id: number, createComponentDto: CreateComponentDto): Promise<User>;
    findAllComponents(id: number): Promise<Component[]>;
    registerAlarm(id: number, createAlarmDto: CreateAlarmDto): Promise<User>;
    findAllAlarms(id: number): Promise<Alarm[]>;
    delete(email: string): Promise<number>;
    deleteAll(): Promise<number>;
}
