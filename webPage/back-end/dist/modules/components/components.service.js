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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../core/constants");
let ComponentsService = class ComponentsService {
    constructor(componentRepository) {
        this.componentRepository = componentRepository;
    }
    async create(createComponentDto, userId) {
        const { data } = createComponentDto, componentDto = __rest(createComponentDto, ["data"]);
        return await this.componentRepository.create(Object.assign(Object.assign({}, componentDto), { data: data ? [data] : [], userId }));
    }
    async findOneByUuid(uuid) {
        return await this.componentRepository.findOne({ where: { uuid } });
    }
    async update(uuid, updateComponentDto) {
        console.log('here');
        const component = await this.componentRepository.findOne({ where: { uuid } });
        if (!component) {
            console.error('Component not found');
            throw new common_1.BadRequestException('Component not found');
        }
        console.log(updateComponentDto);
        await component.update(updateComponentDto);
        return await component.save();
    }
    async newData(uuid, newData) {
        const component = await this.componentRepository.findOne({ where: { uuid } });
        if (!component) {
            throw new common_1.BadRequestException('Component not found');
        }
        component.data = [...component.data, newData];
        return await component.save();
    }
    async deleteById(uuid) {
        return await this.componentRepository.destroy({ where: { uuid } });
    }
};
ComponentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.COMPONENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ComponentsService);
exports.ComponentsService = ComponentsService;
//# sourceMappingURL=components.service.js.map