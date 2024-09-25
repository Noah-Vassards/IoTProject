import { TokenService } from './token.service';
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    getAll(ip: any): Promise<import("./token.entity").Token[]>;
    deleteByUserId(ip: any, req: any): Promise<number | any[]>;
}
