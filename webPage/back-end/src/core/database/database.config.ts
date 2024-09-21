import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './dbConfig.interface';
import { DIALECT } from '../constants';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: DIALECT,
    urlDatabase: 'dev'
};