import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

/**
 * Service responsible for authentication-related operations.
 * @class
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Validates a user's credentials.
     * @param {string} username - The username.
     * @param {string} pass - The password.
     * @returns {Promise<any>} - A promise resolving to the validated user if successful, or null if validation fails.
     */
    async validateUser(username: string, pass: string) {
        console.debug('----------')
        console.debug(username)
        console.debug(pass)
        console.debug('----------')

        // find if user exist with this email
        const user = await this.userService.findOneByEmail(username);
        // console.debug("user debug", user)
        if (!user) {
            return null;
        }

        // find if user password match
        const match = await this.comparePassword(pass, user.dataValues.password);
        console.debug("password match", match)
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    /**
     * Logs in a user and updates its access_token.
     * @param {User} user - The user object.
     * @returns {Promise<any>} - A promise resolving to the login response, including the user and token.
     */
    public async login(user: User, component: string, alarm: string): Promise<any> {
        const userToken = await this.tokenService.findOneByUserId(user.id)
        const newToken = await this.generateToken(user)

        if (component) {
            await this.userService.registerComponent(user.id, component)
        }
        if (alarm) {
            await this.userService.registerAlarm(user.id, alarm)
        }
        await this.tokenService.updateToken(userToken, newToken)
        return { user: user, token: newToken };
    }

    /**
     * Creates a new user and its associated Token.
     * @param {UserDto} user - The user data.
     * @returns {Promise<any>} - A promise resolving to the created user and token.
     */
    public async create(signUpDto: SignUpDto): Promise<any> {
        const userInfos = { email: signUpDto.email, name: signUpDto.name }

        const pass = await this.hashPassword(signUpDto.password);
        const newUser = await this.userService.create({ ...userInfos, password: pass });
        const { password, ...result } = newUser['dataValues'];

        const token = await this.generateToken(result);

        let date = new Date();
        date.setDate(date.getDate() + 7);
        console.log(date)

        await this.tokenService.create({ access_token: token, expiration_date: date }, newUser.id)

        if (signUpDto.component) {
            await this.userService.registerComponent(newUser.id, signUpDto.component)
        }

        if (signUpDto.alarm) {
            await this.userService.registerAlarm(newUser.id, signUpDto.alarm)
        }
        
        return { user: result, token };
    }

    /**
     * Generate a new JWT token 
     * @param {object} user - the user data
     * @returns {Promise<any>} - A Promise resoling to the new generated token
     */
    private async generateToken(user: any): Promise<any> {
        const token = await this.jwtService.signAsync({ email: user.email, id: user.id, role: user.role });
        return token;
    }

    /**
     * Hash the given password using bcrypt
     * @param {string} password - the password to be hashed
     * @returns {Promise<any>} - A promise resolving in the hashed password
     */
    private async hashPassword(password: string): Promise<any> {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    /**
     * Compare both given hashed password using bcrypt
     * @param {string} enteredPassword - The password sent by the user
     * @param dbPassword - The password stored in the database
     * @returns {Promise<any>} - A promise resolving in the result of the comparison; true if the two password match, false otherwise
     */
    private async comparePassword(enteredPassword: string, dbPassword: string): Promise<any> {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}