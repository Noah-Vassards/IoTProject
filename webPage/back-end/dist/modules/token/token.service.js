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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../core/constants");
let TokenService = class TokenService {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async create(token, user_id) {
        return await this.tokenRepository.create(Object.assign(Object.assign({}, token), { user_id }));
    }
    async findAll() {
        return await this.tokenRepository.findAll();
    }
    async findOne(id) {
        return await this.tokenRepository.findOne({ where: { id } });
    }
    async findOneByAccessToken(access_token) {
        return await this.tokenRepository.findOne({ where: { access_token } });
    }
    async findOneByUserId(userId) {
        return await this.tokenRepository.findOne({ where: { user_id: userId } });
    }
    async delete(id) {
        return await this.tokenRepository.destroy({ where: { id } });
    }
    async deleteByUserId(user_id) {
        return await this.tokenRepository.destroy({ where: { user_id } });
    }
    async updateToken(tokenEntity, newToken) {
        console.log(newToken.access_token);
        tokenEntity.access_token = newToken.access_token;
        tokenEntity.expiration_date = this.getNewExpirationDate(newToken.expires_in);
        tokenEntity.refresh_token = newToken.refresh_token;
        await tokenEntity.save();
        console.log(tokenEntity['dataValues']);
    }
    getNewExpirationDate(expDate) {
        console.log("exp date", expDate);
        const newExpirationDate = new Date();
        newExpirationDate.setDate(newExpirationDate.getDate() + (expDate || 7));
        return newExpirationDate;
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.TOKEN_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map