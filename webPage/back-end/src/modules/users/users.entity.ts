import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Component } from '../components/component.entity';
import { Alarm } from '../alarms/alarm.entity';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @HasMany(() => Component)
    components: Component[]

    @HasMany(() => Alarm)
    alarms: Alarm[]
}