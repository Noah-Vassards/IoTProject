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
exports.DoesUserIdExist = exports.DoesUserExist = exports.DoesUserAlreadyExist = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../modules/users/users.service");
let DoesUserAlreadyExist = class DoesUserAlreadyExist {
    constructor(userService) {
        this.userService = userService;
    }
    canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        console.log(request === null || request === void 0 ? void 0 : request.body);
        console.log((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.email);
        return this.validateRequest((_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.email);
    }
    async validateRequest(email) {
        console.log("HERE");
        if (!email) {
            throw new common_1.BadRequestException('No email address provided');
        }
        const userExist = await this.userService.findOneByEmail(email);
        if (userExist) {
            throw new common_1.BadRequestException('This email already exists');
        }
        return true;
    }
};
DoesUserAlreadyExist = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], DoesUserAlreadyExist);
exports.DoesUserAlreadyExist = DoesUserAlreadyExist;
let DoesUserExist = class DoesUserExist {
    constructor(userService) {
        this.userService = userService;
    }
    canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.email) || ((_b = request === null || request === void 0 ? void 0 : request.query) === null || _b === void 0 ? void 0 : _b.email));
    }
    async validateRequest(email) {
        console.log(email);
        if (!email) {
            throw new common_1.NotImplementedException('No email address provided');
        }
        const userExist = await this.userService.findOneByEmail(email);
        if (!userExist) {
            throw new common_1.NotImplementedException('User unknown');
        }
        return true;
    }
};
DoesUserExist = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], DoesUserExist);
exports.DoesUserExist = DoesUserExist;
let DoesUserIdExist = class DoesUserIdExist {
    constructor(userService) {
        this.userService = userService;
    }
    canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        return this.validateRequest((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.id);
    }
    async validateRequest(id) {
        if (!id) {
            throw new common_1.BadRequestException('User id not provided');
        }
        const userExist = await this.userService.findOneById(id);
        if (!userExist) {
            throw new common_1.NotImplementedException('User unknown');
        }
        return true;
    }
};
DoesUserIdExist = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], DoesUserIdExist);
exports.DoesUserIdExist = DoesUserIdExist;
//# sourceMappingURL=doesUserExist.guards.js.map