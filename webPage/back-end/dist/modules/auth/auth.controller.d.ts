/// <reference types="cookie-parser" />
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(request: Request): Promise<any>;
    signUp(user: UserDto): Promise<any>;
}
