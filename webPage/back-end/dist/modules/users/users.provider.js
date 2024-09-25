"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersProviders = void 0;
const users_entity_1 = require("./users.entity");
const constants_1 = require("../../core/constants");
exports.usersProviders = [{
        provide: constants_1.USER_REPOSITORY,
        useValue: users_entity_1.User,
    }];
//# sourceMappingURL=users.provider.js.map