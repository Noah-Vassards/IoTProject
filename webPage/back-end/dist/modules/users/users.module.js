"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const token_provider_1 = require("../token/token.provider");
const token_service_1 = require("../token/token.service");
const users_controller_1 = require("./users.controller");
const users_provider_1 = require("./users.provider");
const users_service_1 = require("./users.service");
const components_service_1 = require("../components/components.service");
const component_provider_1 = require("../components/component.provider");
const alarm_service_1 = require("../alarms/alarm.service");
const alarm_provider_1 = require("../alarms/alarm.provider");
const mqtt_module_1 = require("../mqtt/mqtt.module");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [mqtt_module_1.MqttModule],
        providers: [users_service_1.UsersService, ...users_provider_1.usersProviders, token_service_1.TokenService, ...token_provider_1.tokenProviders, components_service_1.ComponentsService, ...component_provider_1.componentProviders, alarm_service_1.AlarmsService, ...alarm_provider_1.alarmProviders],
        exports: [users_service_1.UsersService],
        controllers: [users_controller_1.UsersController]
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map