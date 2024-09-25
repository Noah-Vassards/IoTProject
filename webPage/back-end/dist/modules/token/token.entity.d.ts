import { Model } from "sequelize-typescript";
export declare class Token extends Model<Token> {
    user_id: number;
    access_token: string;
    expiration_date: Date;
    refresh_token: string;
}
