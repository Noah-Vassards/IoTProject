import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Token } from "../../modules/token/token.entity";
import { TokenService } from "../../modules/token/token.service";
import { UsersService } from "../../modules/users/users.service";

@Injectable()
export class IsAutenticated implements CanActivate {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService
    ) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        // console.log('canActivate ------> request', request)
        // console.log('cookie', request.cookies)
        return this.validateRequest(request?.body?.email, request?.cookies?.token)
    }

    async validateRequest(email: any, token: string) {
        if (!token) {
            throw new UnauthorizedException('Token not found')
        }

        const dbToken = await this.getTokenInDatabase(token)

        if (!dbToken) {
            throw new UnauthorizedException('Token does not exist')
        }

        const user = await this.userService.findOneByEmail(email)
        if (!this.tokenBelongsToUser(dbToken, user.id)) {
            throw new UnauthorizedException('Token does not match user')
        }
        console.log('heeeeeeeelllloooooooo')
        if (this.isTokenExpired(dbToken)) {
            throw new UnauthorizedException('Token is expired')
        }

        return true
    }

    private async getTokenInDatabase(token: string): Promise<Token> {
        console.log('test')
        console.log(token)
        return await this.tokenService.findOneByAccessToken(token)
    }

    private tokenBelongsToUser(token: Token, userId: number): boolean {
        const tokenUserId = token.user_id;
        console.log("--------------->", tokenUserId)
        console.log("--------------->", userId)

        if (tokenUserId != userId) {
            return false;
        }
        
        return true;
    }

    private isTokenExpired(token: Token): boolean {
        const currentDate = new Date()
        const tokenExpDate = token.expiration_date
        console.log(token.expiration_date)
        console.log(tokenExpDate.getTime())

        currentDate.setDate(currentDate.getDate() - 7)
        console.log(currentDate.getTime())
        if (currentDate.getTime() >= tokenExpDate.getTime()) {
            return true
        }

        return false
    }

}