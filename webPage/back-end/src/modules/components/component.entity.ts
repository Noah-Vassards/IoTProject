import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.entity';
import { Alarm } from '../alarms/alarm.entity';

@Table
export class Component extends Model<Component> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    uuid?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "Nouveau Capteur"
    })
    name: string

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: []
    })
    data: {date: Date, temperature: number, humidity: number}[]

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @BelongsTo(() => User)
    user: User
} 