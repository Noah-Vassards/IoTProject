import { Alarm } from "../alarms/alarm.entity";
import { Component } from "../components/component.entity";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    deleteByMail(req: any): Promise<number>;
    getAll(ip: any): Promise<User[]>;
    registerComponent(userId: number, body: {
        uuid: string;
    }): Promise<User>;
    getAllComponents(userId: number): Promise<Component[]>;
    registerAlarm(userId: number, body: {
        uuid: string;
    }): Promise<User>;
    getAllAlarms(userId: number): Promise<Alarm[]>;
}
