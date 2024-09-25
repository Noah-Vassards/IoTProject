import { Model } from 'sequelize-typescript';
import { Component } from '../components/component.entity';
import { Alarm } from '../alarms/alarm.entity';
export declare class User extends Model<User> {
    name: string;
    email: string;
    password: string;
    components: Component[];
    alarms: Alarm[];
}
