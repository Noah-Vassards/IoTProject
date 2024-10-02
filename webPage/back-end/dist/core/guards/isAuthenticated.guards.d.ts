import { CanActivate, ExecutionContext } from "@nestjs/common";
import { TokenService } from "../../modules/token/token.service";
import { UsersService } from "../../modules/users/users.service";
export declare class IsAutenticated implements CanActivate {
    private readonly userService;
    private readonly tokenService;
    private readonly client;
    constructor(userService: UsersService, tokenService: TokenService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateRequest(email: any, token: string): Promise<boolean>;
    private getTokenInDatabase;
    private tokenBelongsToUser;
    private isTokenExpired;
}
