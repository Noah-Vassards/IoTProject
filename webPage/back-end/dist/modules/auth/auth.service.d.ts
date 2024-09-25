import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { TokenService } from '../token/token.service';
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    private readonly jwtService;
    constructor(userService: UsersService, tokenService: TokenService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<{
        name: string;
        email: string;
        components: import("../components/component.entity").Component[];
        alarms: import("../alarms/alarm.entity").Alarm[];
        id?: any;
        createdAt?: any;
        updatedAt?: any;
        deletedAt?: any;
        version?: any;
        _attributes: import("../users/users.entity").User;
        dataValues: import("../users/users.entity").User;
        _creationAttributes: import("../users/users.entity").User;
        isNewRecord: boolean;
        sequelize: import("sequelize").Sequelize;
        _model: import("sequelize").Model<import("../users/users.entity").User, import("../users/users.entity").User>;
    }>;
    login(userInfo: any, tokenInfo: any): Promise<any>;
    create(user: UserDto, tokenInfo: any): Promise<any>;
    private generateToken;
    private hashPassword;
    private comparePassword;
}
