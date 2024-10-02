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
exports.ComponentsController = void 0;
const common_1 = require("@nestjs/common");
const components_service_1 = require("./components.service");
const updateComponent_dto_1 = require("./dto/updateComponent.dto");
let ComponentsController = class ComponentsController {
    constructor(componentService) {
        this.componentService = componentService;
    }
    async findOneByUuid(uuid) {
        return await this.componentService.findOneByUuid(uuid);
    }
    async update(uuid, updateComponentDto) {
        return await this.componentService.update(uuid, updateComponentDto);
    }
    async newData(uuid, newData) {
        return await this.componentService.newData(uuid, newData);
    }
    async deleteByUuid(uuid) {
        return await this.componentService.deleteById(uuid);
    }
};
__decorate([
    (0, common_1.Get)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComponentsController.prototype, "findOneByUuid", null);
__decorate([
    (0, common_1.Patch)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateComponent_dto_1.UpdateComponentDto]),
    __metadata("design:returntype", Promise)
], ComponentsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':uuid/newData'),
    __param(0, (0, common_1.Param)('uuid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComponentsController.prototype, "newData", null);
__decorate([
    (0, common_1.Delete)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComponentsController.prototype, "deleteByUuid", null);
ComponentsController = __decorate([
    (0, common_1.Controller)('components'),
    __metadata("design:paramtypes", [components_service_1.ComponentsService])
], ComponentsController);
exports.ComponentsController = ComponentsController;
//# sourceMappingURL=components.controller.js.map