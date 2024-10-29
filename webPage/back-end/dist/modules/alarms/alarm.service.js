"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmsService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../core/constants");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let AlarmsService = class AlarmsService {
    constructor(alarmRepository, mqttService, eventEmitter) {
        this.alarmRepository = alarmRepository;
        this.mqttService = mqttService;
        this.eventEmitter = eventEmitter;
    }
    async create(createAlarmDto, userId) {
        const alarm = this.alarmRepository.findOne({ where: { uuid: createAlarmDto.uuid } });
        if (alarm) {
            throw new common_1.BadRequestException('Alarm already exists');
        }
        return await this.alarmRepository.create(Object.assign(Object.assign({}, createAlarmDto), { userId }));
    }
    async findOneByUuid(uuid) {
        return await this.alarmRepository.findOne({ where: { uuid } });
    }
    async findAll() {
        return await this.alarmRepository.findAll();
    }
    async update(uuid, updateAlarmDto) {
        const component = await this.alarmRepository.findOne({ where: { uuid } });
        if (!component) {
            console.error('Alarm not found');
            throw new common_1.BadRequestException('Alarm not found');
        }
        await component.update(updateAlarmDto);
        return await component.save();
    }
    async activate(uuid, activation) {
        const alarm = await this.alarmRepository.findOne({ where: { uuid } });
        if (!alarm) {
            throw new common_1.BadRequestException('Alarm not found');
        }
        const canActivate = alarm.disabledUntil ? alarm.disabledUntil.getTime() < Date.now() : true;
        console.log('---------------- > ', canActivate);
        if (canActivate) {
            if (activation && !alarm.activated) {
                this.eventEmitter.emit('notify.activation', { userId: alarm.userId, alarmName: alarm.name });
                const date = new Date();
                alarm.activations = [...alarm.activations, { activatedAt: date, lasted: 0 }];
            }
            else if (!activation && alarm.activated) {
                const lastActivation = alarm.activations[alarm.activations.length - 1];
                if (lastActivation) {
                    const activatedAt = new Date(lastActivation.activatedAt);
                    const lasted = (Date.now() - activatedAt.getTime()) / 1000;
                    lastActivation.lasted = lasted;
                    alarm.activations[alarm.activations.length - 1] = lastActivation;
                }
            }
        }
        console.log(alarm.activations);
        return await alarm.update({ activations: alarm.activations, activated: activation });
    }
    async forceDeactivation(uuid) {
        console.log('force deactivation');
        const alarm = await this.alarmRepository.findOne({ where: { uuid } });
        if (!alarm) {
            throw new common_1.BadRequestException('Alarm not found');
        }
        this.mqttService.publish(`/deactivate/${alarm.uuid}`, "");
        alarm.activated = false;
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        alarm.disabledUntil = currentDate;
        return await alarm.save();
    }
    async deleteById(uuid) {
        return await this.alarmRepository.destroy({ where: { uuid } });
    }
};
AlarmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.ALARM_REPOSITORY)),
    __metadata("design:paramtypes", [Object, mqtt_service_1.MqttService,
        event_emitter_1.EventEmitter2])
], AlarmsService);
exports.AlarmsService = AlarmsService;
//# sourceMappingURL=alarm.service.js.map