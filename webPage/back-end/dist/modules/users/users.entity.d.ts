import { Model } from 'sequelize-typescript';
import { Component } from '../components/component.entity';
import { Alarm } from '../alarms/alarm.entity';
import { Token } from '../token/token.entity';
export declare class User extends Model<User> {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    token: Token;
    components: Component[];
    alarms: Alarm[];
}
