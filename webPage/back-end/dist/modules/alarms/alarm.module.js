"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmsModule = void 0;
const common_1 = require("@nestjs/common");
const alarm_provider_1 = require("./alarm.provider");
const alarm_service_1 = require("./alarm.service");
const alarm_controller_1 = require("./alarm.controller");
let AlarmsModule = class AlarmsModule {
};
AlarmsModule = __decorate([
    (0, common_1.Module)({
        providers: [alarm_service_1.AlarmsService, ...alarm_provider_1.alarmProviders,],
        exports: [alarm_service_1.AlarmsService],
        controllers: [alarm_controller_1.AlarmsController]
    })
], AlarmsModule);
exports.AlarmsModule = AlarmsModule;
//# sourceMappingURL=alarm.module.js.map