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
exports.AlarmsController = void 0;
const common_1 = require("@nestjs/common");
const alarm_service_1 = require("./alarm.service");
const updateAlarm_dto_1 = require("./dto/updateAlarm.dto");
let AlarmsController = class AlarmsController {
    constructor(alarmsService) {
        this.alarmsService = alarmsService;
    }
    async findOneByUuid(uuid) {
        return await this.alarmsService.findOneByUuid(uuid);
    }
    async findAll() {
        return await this.alarmsService.findAll();
    }
    async update(uuid, updateAlarmDto) {
        return await this.alarmsService.update(uuid, updateAlarmDto);
    }
    async activate(uuid, activation) {
        return await this.alarmsService.activate(uuid, activation);
    }
    async forceDeactivation(uuid) {
        return await this.alarmsService.forceDeactivation(uuid);
    }
    async deleteByUuid(uuid) {
        return await this.alarmsService.deleteById(uuid);
    }
};
__decorate([
    (0, common_1.Get)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "findOneByUuid", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateAlarm_dto_1.UpdateAlarmDto]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':uuid/activate/:activation'),
    __param(0, (0, common_1.Param)('uuid')),
    __param(1, (0, common_1.Param)('activation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':uuid/forceDeactivation'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "forceDeactivation", null);
__decorate([
    (0, common_1.Delete)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlarmsController.prototype, "deleteByUuid", null);
AlarmsController = __decorate([
    (0, common_1.Controller)('alarms'),
    __metadata("design:paramtypes", [alarm_service_1.AlarmsService])
], AlarmsController);
exports.AlarmsController = AlarmsController;
//# sourceMappingURL=alarm.controller.js.map