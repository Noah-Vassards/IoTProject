import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.entity';
import { Component } from '../components/component.entity';

@Table
export class Alarm extends Model<Alarm> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    uuid?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "Nouveau Regulateur"
    })
    name: string

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
        defaultValue: [0, 100]
    })
    humidityRange: number[]

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
        defaultValue: [0, 100]
    })
    temperatureRange: number[]

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    activated: boolean

    @Column({
        type: DataType.ARRAY(DataType.JSON),
        allowNull: false,
        defaultValue: []
    })
    activations: {activatedAt: Date, lasted: number}[]

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    disabledUntil: Date

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: ''
    })
    linkedComponentUuid: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @BelongsTo(() => User)
    user: User
} 