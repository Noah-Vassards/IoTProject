import { Alarm } from "../alarms/alarm.entity";
import { Component } from "../components/component.entity";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    deleteByMail(req: any): Promise<number>;
    getAll(req: any): Promise<User[]>;
    registerComponent(req: any, body: {
        uuid: string;
    }): Promise<User>;
    getAllComponents(req: any): Promise<Component[]>;
    registerAlarm(req: any, body: {
        uuid: string;
    }): Promise<User>;
    getAllAlarms(req: any): Promise<Alarm[]>;
}
