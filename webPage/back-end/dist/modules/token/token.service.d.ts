import { TokenDto } from './dto/token.dto';
import { Token } from './token.entity';
export declare class TokenService {
    private readonly tokenRepository;
    constructor(tokenRepository: typeof Token);
    create(token: TokenDto, user_id: number): Promise<Token>;
    findAll(): Promise<Token[]>;
    findOne(id: number): Promise<Token>;
    findOneByAccessToken(access_token: string): Promise<Token>;
    findOneByUserId(userId: number): Promise<Token>;
    delete(id: number): Promise<number>;
    deleteByUserId(user_id: number): Promise<number>;
    updateToken(tokenEntity: Token, newToken: any): Promise<void>;
    private getNewExpirationDate;
}
