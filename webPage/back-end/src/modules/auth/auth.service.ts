import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { TokenService } from '../token/token.service';

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
    public async login(userInfo: any, tokenInfo: any): Promise<any> {
        console.info("user", userInfo)
        console.debug("tokenInfo", tokenInfo)
        console.debug(userInfo.password)
        let newTokenInfo = {
            access_token: "",
            expires_in: 0,
            refresh_token: "",
        };
        const userToken = await this.tokenService.findOneByUserId(userInfo.id)
        const currentDate = new Date()

        if (currentDate.getTime() < userToken.expiration_date.getTime()) {
            console.log('token not expired')
            return {user: userInfo, token: userToken.access_token}
        }
        console.log('token expired')
        if (tokenInfo) {
            newTokenInfo.access_token = tokenInfo.access_token
            newTokenInfo.expires_in = tokenInfo.expires_in
            newTokenInfo.refresh_token = tokenInfo.refresh_token
        } else {
            newTokenInfo.access_token = await this.generateToken(userInfo);
        }
        console.log(newTokenInfo)
        await this.tokenService.updateToken(userToken, newTokenInfo)
        return { user: userInfo, token: newTokenInfo.access_token };
    }

    /**
     * Creates a new user and its associated Token.
     * @param {UserDto} user - The user data.
     * @returns {Promise<any>} - A promise resolving to the created user and token.
     */
    public async create(user: UserDto, tokenInfo: any): Promise<any> {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        console.log('----------------')
        console.log(result)

        // generate token

        let token = "";
        let refresh_token = "";
        let expIn = 0;
        console.log(token)
        
        if (tokenInfo && tokenInfo?.access_token !== '') {
            token = tokenInfo.access_token;
            refresh_token = tokenInfo.refresh_token
            expIn = tokenInfo.expires_in
        } else {
            token = await this.generateToken(result);
        }
        console.log(token)

        let date = new Date();
        date.setDate(date.getDate() + (expIn || 7));
        console.log(date)

        const newToken = await this.tokenService.create({access_token: token, expiration_date: date, refresh_token: refresh_token}, result.id)
        console.log(newToken['dataValues'])
        // return the user and the token
        return { user: result, token };
    }

    /**
     * Generate a new JWT token 
     * @param {object} user - the user data
     * @returns {Promise<any>} - A Promise resoling to the new generated token
     */
    private async generateToken(user: object): Promise<any> {
        const token = await this.jwtService.signAsync(user);
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