import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.entity";

@Table
export class Token extends Model<Token> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    access_token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expiration_date: Date
}