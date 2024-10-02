"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const component_entity_1 = require("../../modules/components/component.entity");
const users_entity_1 = require("../../modules/users/users.entity");
const token_entity_1 = require("../../modules/token/token.entity");
const constants_1 = require("../constants");
const database_config_1 = require("./database.config");
const alarm_entity_1 = require("../../modules/alarms/alarm.entity");
exports.databaseProviders = [{
        provide: constants_1.SEQUELIZE,
        useFactory: async () => {
            const config = database_config_1.databaseConfig;
            console.log(config);
            const sequelize = new sequelize_typescript_1.Sequelize(config.database, config.username, config.password, { dialect: config.dialect, host: config.host, port: config.port });
            console.log('sequelize here');
            sequelize.addModels([users_entity_1.User, token_entity_1.Token, component_entity_1.Component, alarm_entity_1.Alarm]);
            console.log('sequelize models');
            await sequelize.sync({ alter: true });
            console.log('sequelize sync');
            return sequelize;
        },
    }];
//# sourceMappingURL=database.provider.js.map