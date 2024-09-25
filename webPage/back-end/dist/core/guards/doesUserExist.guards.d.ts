import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';
export declare class DoesUserAlreadyExist implements CanActivate {
    private readonly userService;
    constructor(userService: UsersService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    validateRequest(email: string): Promise<boolean>;
}
export declare class DoesUserExist implements CanActivate {
    private readonly userService;
    constructor(userService: UsersService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    validateRequest(email: string): Promise<boolean>;
}
export declare class DoesUserIdExist implements CanActivate {
    private readonly userService;
    constructor(userService: UsersService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    validateRequest(id: number): Promise<boolean>;
}
