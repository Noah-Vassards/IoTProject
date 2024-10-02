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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../core/constants");
const alarm_entity_1 = require("../alarms/alarm.entity");
const alarm_service_1 = require("../alarms/alarm.service");
const component_entity_1 = require("../components/component.entity");
const components_service_1 = require("../components/components.service");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const token_service_1 = require("../token/token.service");
let UsersService = class UsersService {
    constructor(userRepository, tokenService, componentService, alarmService, mqttService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.componentService = componentService;
        this.alarmService = alarmService;
        this.mqttService = mqttService;
    }
    async create(user) {
        return await this.userRepository.create(user);
    }
    async findAll() {
        console.log('getting all users');
        return await this.userRepository.findAll({ include: component_entity_1.Component });
    }
    async findOneByEmail(email) {
        return await this.userRepository.findOne({ where: { email }, include: component_entity_1.Component });
    }
    async findOneById(id) {
        return await this.userRepository.findOne({ where: { id }, include: component_entity_1.Component });
    }
    async registerComponent(id, uuid) {
        this.mqttService.subscribeToTopic(`/validate/${uuid}`);
        this.mqttService.publish(`/check/${uuid}`, JSON.stringify({ userId: id }));
        const message = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new common_1.BadRequestException('Timeout: No response received from the MQTT broker.'));
            }, 5000);
            this.mqttService.setMessageCallback((topic, payload) => {
                if (topic === `/validate/${uuid}`) {
                    clearTimeout(timeout);
                    resolve(payload);
                }
            });
        });
        if (!JSON.parse(message).validate) {
            throw new common_1.BadRequestException();
        }
        const user = await this.userRepository.findOne({ where: { id }, include: component_entity_1.Component });
        if (!user) {
            throw new common_1.BadRequestException('User is unknown');
        }
        const component = await this.componentService.create({ uuid: uuid, name: "Nouveau Capteur", data: undefined }, id);
        user.components.push(component);
        return user.save();
    }
    async findAllComponents(id) {
        const user = await this.userRepository.findOne({ where: { id }, include: component_entity_1.Component });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user.components;
    }
    async registerAlarm(id, uuid) {
        this.mqttService.subscribeToTopic(`/validate/${uuid}`);
        this.mqttService.publish(`/check/${uuid}`, JSON.stringify({ userId: id }));
        const message = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new common_1.BadRequestException('Timeout: No response received from the MQTT broker.'));
            }, 5000);
            this.mqttService.setMessageCallback((topic, payload) => {
                if (topic === `/validate/${uuid}`) {
                    clearTimeout(timeout);
                    resolve(payload);
                }
            });
        });
        if (!JSON.parse(message).validate) {
            throw new common_1.BadRequestException();
        }
        const user = await this.userRepository.findOne({ where: { id }, include: alarm_entity_1.Alarm });
        if (!user) {
            throw new common_1.BadRequestException('User is unknown');
        }
        const alarm = await this.alarmService.create({ uuid, name: 'Nouveau Régulateur', activated: false }, id);
        user.alarms.push(alarm);
        return user.save();
    }
    async findAllAlarms(id) {
        const user = await this.userRepository.findOne({ where: { id }, include: alarm_entity_1.Alarm });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user.alarms;
    }
    async delete(email) {
        const users = await this.userRepository.findAll({ where: { email } });
        users.forEach(async (user) => {
            await this.tokenService.deleteByUserId(user.id);
        });
        return await this.userRepository.destroy({ where: { email } });
    }
    async deleteAll() {
        return await this.userRepository.destroy();
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, token_service_1.TokenService,
        components_service_1.ComponentsService,
        alarm_service_1.AlarmsService,
        mqtt_service_1.MqttService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map