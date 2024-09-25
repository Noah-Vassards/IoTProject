import { UsersService } from "./users.service";
import { Component } from "../components/component.entity";
import { User } from "./users.entity";
import { CreateComponentDto } from "../components/dto/createComponent.dto";
import { CreateAlarmDto } from "../alarms/dto/createAlarm.dto";
import { Alarm } from "../alarms/alarm.entity";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    deleteByMail(req: any): Promise<number>;
    getAll(ip: any): Promise<User[]>;
    registerComponent(userId: number, createComponentDto: CreateComponentDto): Promise<User>;
    getAllComponents(userId: number): Promise<Component[]>;
    registerAlarm(userId: number, createAlarmDto: CreateAlarmDto): Promise<User>;
    getAllAlarms(userId: number): Promise<Alarm[]>;
}
