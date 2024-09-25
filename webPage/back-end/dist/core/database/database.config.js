"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const dotenv = require("dotenv");
const constants_1 = require("../constants");
dotenv.config();
exports.databaseConfig = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: constants_1.DIALECT,
    urlDatabase: 'dev'
};
//# sourceMappingURL=database.config.js.map