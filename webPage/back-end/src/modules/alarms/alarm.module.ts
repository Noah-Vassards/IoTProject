import { Module } from '@nestjs/common';
import { alarmProviders } from './alarm.provider';
import { AlarmsService } from './alarm.service';
import { AlarmsController } from './alarm.controller';

@Module({
    providers: [AlarmsService, ...alarmProviders, ],
    exports: [AlarmsService],
    controllers: [AlarmsController]
})
export class AlarmsModule {}
