import { Dialect } from "sequelize";
export interface IDatabaseConfig {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number;
    dialect?: Dialect;
    urlDatabase?: string;
}
