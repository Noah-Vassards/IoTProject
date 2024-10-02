import { Model } from 'sequelize-typescript';
import { User } from '../users/users.entity';
export declare class Alarm extends Model<Alarm> {
    uuid?: string;
    name: string;
    humidityRange: number[];
    temperatureRange: number[];
    activated: boolean;
    linkedComponentUuid: string;
    userId: number;
    user: User;
}
