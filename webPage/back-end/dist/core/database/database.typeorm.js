"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const users_entity_1 = require("../../modules/users/users.entity");
const typeormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    entities: [
        users_entity_1.User
    ],
    synchronize: true
};
exports.typeormConfig = typeormConfig;
//# sourceMappingURL=database.typeorm.js.map