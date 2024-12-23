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
const mail_service_1 = require("../mail/mail.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let UsersService = class UsersService {
    constructor(userRepository, tokenService, componentService, alarmService, mqttService, mailService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.componentService = componentService;
        this.alarmService = alarmService;
        this.mqttService = mqttService;
        this.mailService = mailService;
    }
    async create(user) {
        return await this.userRepository.create(user);
    }
    async findAll() {
        console.log('getting all users');
        return await this.userRepository.findAll({ include: [component_entity_1.Component, alarm_entity_1.Alarm] });
    }
    async findOneByEmail(email) {
        return await this.userRepository.findOne({ where: { email }, include: component_entity_1.Component });
    }
    async findOneById(id) {
        return await this.userRepository.findOne({ where: { id }, include: component_entity_1.Component });
    }
    async notifyUser(payload) {
        const user = await this.userRepository.findOne({ where: { id: payload.userId } });
        const mailBody = `Bonjour ${user.name},<br><br>

        Le régulateur '${payload.alarmName}' a été activé.<br>
        Si vous souhaiter qu'il reste éteint, vous pouvez le désactiver manuellemenent.<br><br>
        
        A bientôt !`;
        await this.mailService.sendMail({ address: [user.email], subject: 'Régulateur activé', text: mailBody, from: "L'équipe Bacchus" });
    }
    async registerComponent(id, uuid) {
        const user = await this.userRepository.findOne({ where: { id }, include: component_entity_1.Component });
        if (!user) {
            throw new common_1.BadRequestException('User is unknown');
        }
        const component = await this.componentService.create({ uuid: uuid, name: "Nouveau Capteur", data: undefined }, id);
        if (!component) {
            throw new common_1.BadRequestException('Error while creating new component');
        }
        const mailBody = `Bonjour ${user.name},<br><br>

        Votre nouveau capteur a été ajouté avec succès.<br>
        Merci de faire confiance à nos service.<br><br>
        
        A bientôt !`;
        await this.mailService.sendMail({ address: [user.email], subject: 'Nouveau capteur ajouté !', text: mailBody, from: "L'équipe Bacchus" });
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
        const user = await this.userRepository.findOne({ where: { id }, include: alarm_entity_1.Alarm });
        if (!user) {
            throw new common_1.BadRequestException('User is unknown');
        }
        const alarm = await this.alarmService.create({ uuid, name: 'Nouveau Régulateur', activated: false }, id);
        const mailBody = `Bonjour ${user.name},<br><br>

        Votre nouveau régulateur a été ajouté avec succès.<br>
        Merci de faire confiance à nos service.<br><br>
        
        A bientôt !`;
        await this.mailService.sendMail({ address: [user.email], subject: 'Nouveau régulateur ajouté !', text: mailBody, from: "L'équipe Bacchus" });
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
__decorate([
    (0, event_emitter_1.OnEvent)('notify.activation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "notifyUser", null);
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, token_service_1.TokenService,
        components_service_1.ComponentsService,
        alarm_service_1.AlarmsService,
        mqtt_service_1.MqttService,
        mail_service_1.MailService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map