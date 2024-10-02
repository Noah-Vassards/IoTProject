import { Model } from 'sequelize-typescript';
import { User } from '../users/users.entity';
export declare class Component extends Model<Component> {
    uuid?: string;
    name: string;
    data: {
        date: Date;
        temperature: number;
        humidity: number;
    }[];
    userId: number;
    user: User;
}
