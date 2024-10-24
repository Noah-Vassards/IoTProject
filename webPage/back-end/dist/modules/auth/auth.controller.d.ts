import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, LoginDto: LoginDto): Promise<any>;
    signUp(signUpDto: SignUpDto): Promise<any>;
}
