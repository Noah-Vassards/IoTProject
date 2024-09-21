import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.entity';

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
    name?: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    temperature?: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    humidity?: number

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
        defaultValue: [0, 100]
    })
    humidityRange?: number[]

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
        defaultValue: [0, 100]
    })
    temperatureRange?: number[]

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId?: number;

    @BelongsTo(() => User)
    user: User
} 