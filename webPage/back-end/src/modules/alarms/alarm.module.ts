import { Module } from '@nestjs/common';
import { alarmProviders } from './alarm.provider';
import { AlarmsService } from './alarm.service';
import { AlarmsController } from './alarm.controller';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
    imports: [MqttModule],
    providers: [AlarmsService, ...alarmProviders, ],
    exports: [AlarmsService],
    controllers: [AlarmsController]
})
export class AlarmsModule {}
