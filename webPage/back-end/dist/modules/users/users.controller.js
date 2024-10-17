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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../core/guards/auth.guard");
const doesUserExist_guards_1 = require("../../core/guards/doesUserExist.guards");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async deleteByMail(req) {
        if (req.user.role !== 'admin') {
            throw new common_1.UnauthorizedException();
        }
        console.debug(req.query || req.body.email);
        return await this.usersService.delete(req.query.email || req.body.email);
    }
    async getAll(req) {
        if (req.user.role !== 'admin') {
            throw new common_1.UnauthorizedException();
        }
        return await this.usersService.findAll();
    }
    async registerComponent(req, body) {
        return await this.usersService.registerComponent(req.user.id, body.uuid);
    }
    async getAllComponents(req) {
        return await this.usersService.findAllComponents(req.user.id);
    }
    async registerAlarm(req, body) {
        return await this.usersService.registerAlarm(req.user.id, body.uuid);
    }
    async getAllAlarms(req) {
        return await this.usersService.findAllAlarms(req.user.id);
    }
};
__decorate([
    (0, common_1.UseGuards)(doesUserExist_guards_1.DoesUserExist),
    (0, common_1.Delete)('deleteByMail'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteByMail", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('components'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerComponent", null);
__decorate([
    (0, common_1.Get)('components'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllComponents", null);
__decorate([
    (0, common_1.Post)('alarms'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerAlarm", null);
__decorate([
    (0, common_1.Get)('alarms'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAlarms", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map