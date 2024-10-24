import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserAlreadyExist, DoesUserExist, DoesUserIdExist } from '../../core/guards/doesUserExist.guards';
import { Request } from 'express';
import { IsAutenticated } from '../../core/guards/isAuthenticated.guards';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Controller responsible for handling authentication-related requests.
 * @class
 */
@Controller('account')
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Logs in a user with provided credentials.
     * @param {Request} request - The request object.
     * @returns {Promise<any>} - A promise resolving to the login response.
     */
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req, @Body() LoginDto: LoginDto) {
        return await this.authService.login(req.user, LoginDto.component, LoginDto.alarm);
    }

    /**
     * Registers a new user.
     * @param {UserDto} user - The user data.
     * @returns {Promise<any>} - A promise resolving to the registration response.
     */
    @UseGuards(DoesUserAlreadyExist)
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return await this.authService.create(signUpDto);
    }
}