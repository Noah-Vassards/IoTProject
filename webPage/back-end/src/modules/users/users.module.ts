import { Module } from '@nestjs/common';
import { tokenProviders } from '../token/token.provider';
import { TokenService } from '../token/token.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.provider';
import { UsersService } from './users.service';
import { ComponentsService } from '../components/components.service';
import { componentProviders } from '../components/component.provider';

@Module({
    providers: [UsersService, ...usersProviders, TokenService, ...tokenProviders, ComponentsService, ...componentProviders],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}