import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { TokenService } from '../token/token.service';
import { User } from '../users/users.entity';
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    private readonly jwtService;
    constructor(userService: UsersService, tokenService: TokenService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<{
        name: string;
        email: string;
        role: "user" | "admin";
        token: import("../token/token.entity").Token;
        components: import("../components/component.entity").Component[];
        alarms: import("../alarms/alarm.entity").Alarm[];
        id?: any;
        createdAt?: any;
        updatedAt?: any;
        deletedAt?: any;
        version?: any;
        _attributes: User;
        dataValues: User;
        _creationAttributes: User;
        isNewRecord: boolean;
        sequelize: import("sequelize").Sequelize;
        _model: import("sequelize").Model<User, User>;
    }>;
    login(userInfo: any): Promise<any>;
    create(user: UserDto): Promise<any>;
    private generateToken;
    private hashPassword;
    private comparePassword;
}
