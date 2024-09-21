import { Table, Column, Model, DataType, HasOne, HasMany, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import { Token } from '../token/token.entity';
import { Component } from '../components/component.entity';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { Attribute } from '@sequelize/core'

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
}