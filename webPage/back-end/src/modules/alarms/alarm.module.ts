import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { AlarmsController } from './alarm.controller';
import { alarmProviders } from './alarm.provider';
import { AlarmsService } from './alarm.service';

@Module({
    imports: [MqttModule, MailModule],
    providers: [AlarmsService, ...alarmProviders],
    exports: [AlarmsService],
    controllers: [AlarmsController]
})
export class AlarmsModule {}
