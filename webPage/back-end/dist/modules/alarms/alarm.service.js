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
let AlarmsService = class AlarmsService {
    constructor(alarmRepository) {
        this.alarmRepository = alarmRepository;
    }
    async create(createAlarmDto, userId) {
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
        const date = new Date();
        date.setDate(date.getDate() - 872);
        alarm.disabledUntil = date;
        if (alarm.disabledUntil && alarm.disabledUntil.getTime() < Date.now()) {
            console.log(activation ? 'activation' : 'deactivation');
            alarm.activated = activation;
        }
        return await alarm.save();
    }
    async forceDeactivation(uuid) {
        console.log('force deactivation');
        const alarm = await this.alarmRepository.findOne({ where: { uuid } });
        if (!alarm) {
            throw new common_1.BadRequestException('Alarm not found');
        }
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
    __metadata("design:paramtypes", [Object])
], AlarmsService);
exports.AlarmsService = AlarmsService;
//# sourceMappingURL=alarm.service.js.map