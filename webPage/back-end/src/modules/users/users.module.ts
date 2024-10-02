import { Module } from '@nestjs/common';
import { tokenProviders } from '../token/token.provider';
import { TokenService } from '../token/token.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.provider';
import { UsersService } from './users.service';
import { ComponentsService } from '../components/components.service';
import { componentProviders } from '../components/component.provider';
import { AlarmsService } from '../alarms/alarm.service';
import { alarmProviders } from '../alarms/alarm.provider';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
    imports: [MqttModule],
    providers: [UsersService, ...usersProviders, TokenService, ...tokenProviders, ComponentsService, ...componentProviders, AlarmsService, ...alarmProviders],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule { }