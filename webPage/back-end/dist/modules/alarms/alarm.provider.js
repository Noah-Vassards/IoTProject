"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alarmProviders = void 0;
const constants_1 = require("../../core/constants");
const alarm_entity_1 = require("./alarm.entity");
exports.alarmProviders = [{
        provide: constants_1.ALARM_REPOSITORY,
        useValue: alarm_entity_1.Alarm,
    }];
//# sourceMappingURL=alarm.provider.js.map