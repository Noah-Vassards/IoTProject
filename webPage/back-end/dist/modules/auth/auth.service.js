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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const token_service_1 = require("../token/token.service");
let AuthService = class AuthService {
    constructor(userService, tokenService, jwtService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
        console.debug('----------');
        console.debug(username);
        console.debug(pass);
        console.debug('----------');
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            return null;
        }
        const match = await this.comparePassword(pass, user.dataValues.password);
        console.debug("password match", match);
        if (!match) {
            return null;
        }
        const _a = user['dataValues'], { password } = _a, result = __rest(_a, ["password"]);
        return result;
    }
    async login(userInfo, tokenInfo) {
        console.info("user", userInfo);
        console.debug("tokenInfo", tokenInfo);
        console.debug(userInfo.password);
        let newTokenInfo = {
            access_token: "",
            expires_in: 0,
            refresh_token: "",
        };
        const userToken = await this.tokenService.findOneByUserId(userInfo.id);
        const currentDate = new Date();
        if (currentDate.getTime() < userToken.expiration_date.getTime()) {
            console.log('token not expired');
            return { user: userInfo, token: userToken.access_token };
        }
        console.log('token expired');
        if (tokenInfo) {
            newTokenInfo.access_token = tokenInfo.access_token;
            newTokenInfo.expires_in = tokenInfo.expires_in;
            newTokenInfo.refresh_token = tokenInfo.refresh_token;
        }
        else {
            newTokenInfo.access_token = await this.generateToken(userInfo);
        }
        console.log(newTokenInfo);
        await this.tokenService.updateToken(userToken, newTokenInfo);
        return { user: userInfo, token: newTokenInfo.access_token };
    }
    async create(user, tokenInfo) {
        const pass = await this.hashPassword(user.password);
        const newUser = await this.userService.create(Object.assign(Object.assign({}, user), { password: pass }));
        const _a = newUser['dataValues'], { password } = _a, result = __rest(_a, ["password"]);
        console.log('----------------');
        console.log(result);
        let token = "";
        let refresh_token = "";
        let expIn = 0;
        console.log(token);
        if (tokenInfo && (tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.access_token) !== '') {
            token = tokenInfo.access_token;
            refresh_token = tokenInfo.refresh_token;
            expIn = tokenInfo.expires_in;
        }
        else {
            token = await this.generateToken(result);
        }
        console.log(token);
        let date = new Date();
        date.setDate(date.getDate() + (expIn || 7));
        console.log(date);
        const newToken = await this.tokenService.create({ access_token: token, expiration_date: date, refresh_token: refresh_token }, result.id);
        console.log(newToken['dataValues']);
        return { user: result, token };
    }
    async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }
    async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
    async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        token_service_1.TokenService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map