import { Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Component } from '../components/component.entity';
import { Alarm } from '../alarms/alarm.entity';
import { Token } from '../token/token.entity';

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

    @Column({
        type: DataType.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user"
    })
    role: "admin" | "user"

    @HasOne(() => Token)
    token: Token

    @HasMany(() => Component)
    components: Component[]

    @HasMany(() => Alarm)
    alarms: Alarm[]
}