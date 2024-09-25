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
exports.IsAutenticated = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const token_service_1 = require("../../modules/token/token.service");
const users_service_1 = require("../../modules/users/users.service");
let IsAutenticated = class IsAutenticated {
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.client = new google_auth_library_1.OAuth2Client('GOOGLE-CLIENT-ID');
    }
    canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        return this.validateRequest((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.email, (_b = request === null || request === void 0 ? void 0 : request.cookies) === null || _b === void 0 ? void 0 : _b.token);
    }
    async validateRequest(email, token) {
        if (!token) {
            throw new common_1.UnauthorizedException('Token not found');
        }
        const dbToken = await this.getTokenInDatabase(token);
        if (!dbToken) {
            throw new common_1.UnauthorizedException('Token does not exist');
        }
        const user = await this.userService.findOneByEmail(email);
        if (!this.tokenBelongsToUser(dbToken, user.id)) {
            throw new common_1.UnauthorizedException('Token does not match user');
        }
        console.log('heeeeeeeelllloooooooo');
        if (this.isTokenExpired(dbToken)) {
            throw new common_1.UnauthorizedException('Token is expired');
        }
        return true;
    }
    async getTokenInDatabase(token) {
        console.log('test');
        console.log(token);
        return await this.tokenService.findOneByAccessToken(token);
    }
    tokenBelongsToUser(token, userId) {
        const tokenUserId = token.user_id;
        console.log("--------------->", tokenUserId);
        console.log("--------------->", userId);
        if (tokenUserId != userId) {
            return false;
        }
        return true;
    }
    isTokenExpired(token) {
        const currentDate = new Date();
        const tokenExpDate = token.expiration_date;
        console.log(token.expiration_date);
        console.log(tokenExpDate.getTime());
        currentDate.setDate(currentDate.getDate() - 7);
        console.log(currentDate.getTime());
        if (currentDate.getTime() >= tokenExpDate.getTime()) {
            return true;
        }
        return false;
    }
};
IsAutenticated = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        token_service_1.TokenService])
], IsAutenticated);
exports.IsAutenticated = IsAutenticated;
//# sourceMappingURL=isAuthenticated.guards.js.map