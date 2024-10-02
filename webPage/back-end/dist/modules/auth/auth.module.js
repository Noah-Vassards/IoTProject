"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const passport_1 = require("@nestjs/passport");
const users_module_1 = require("../users/users.module");
const local_strategy_1 = require("./local.strategy");
const jwt_1 = require("@nestjs/jwt");
const token_module_1 = require("../token/token.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            token_module_1.TokenModule,
            passport_1.PassportModule,
            users_module_1.UsersModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: process.env.JWTKEY,
                    signOptions: { expiresIn: process.env.TOKEN_EXPIRATION }
                })
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
        ],
        controllers: [auth_controller_1.AuthController]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map