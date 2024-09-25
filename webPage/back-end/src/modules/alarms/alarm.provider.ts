import { ALARM_REPOSITORY } from '../../core/constants';
import { Alarm } from './alarm.entity';

export const alarmProviders = [{
    provide: ALARM_REPOSITORY,
    useValue: Alarm,
}];