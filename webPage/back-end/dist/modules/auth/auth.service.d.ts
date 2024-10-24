import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    private readonly jwtService;
    constructor(userService: UsersService, tokenService: TokenService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<{
        name: string;
        email: string;
        role: "admin" | "user";
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
    login(user: User, uuid: string): Promise<any>;
    create(signUpDto: SignUpDto): Promise<any>;
    private generateToken;
    private hashPassword;
    private comparePassword;
}
