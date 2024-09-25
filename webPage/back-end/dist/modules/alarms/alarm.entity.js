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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alarm = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_entity_1 = require("../users/users.entity");
let Alarm = class Alarm extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Alarm.prototype, "uuid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: "Nouveau Regulateur"
    }),
    __metadata("design:type", String)
], Alarm.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.INTEGER),
        allowNull: false,
        defaultValue: [0, 100]
    }),
    __metadata("design:type", Array)
], Alarm.prototype, "humidityRange", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.INTEGER),
        allowNull: false,
        defaultValue: [0, 100]
    }),
    __metadata("design:type", Array)
], Alarm.prototype, "temperatureRange", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], Alarm.prototype, "activated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: ''
    }),
    __metadata("design:type", String)
], Alarm.prototype, "linkedComponentUuid", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], Alarm.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.User),
    __metadata("design:type", users_entity_1.User)
], Alarm.prototype, "user", void 0);
Alarm = __decorate([
    sequelize_typescript_1.Table
], Alarm);
exports.Alarm = Alarm;
//# sourceMappingURL=alarm.entity.js.map