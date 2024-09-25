import { Sequelize } from 'sequelize-typescript';
import { Component } from 'src/modules/components/component.entity';
import { User } from 'src/modules/users/users.entity';
import { Token } from '../../modules/token/token.entity';
import { SEQUELIZE } from '../constants';
import { databaseConfig } from './database.config';
import { IDatabaseConfig } from './dbConfig.interface';
import { Alarm } from '../../modules/alarms/alarm.entity';

export const databaseProviders = [{
   provide: SEQUELIZE,
   useFactory: async () => {
      const config: IDatabaseConfig = databaseConfig;
      console.log(config)
      const sequelize = new Sequelize(config.database, config.username, config.password, { dialect: config.dialect, host: config.host, port: config.port });
      console.log('sequelize here')
      sequelize.addModels([User, Token, Component, Alarm]);
      console.log('sequelize models')
      await sequelize.sync({alter: true});
      console.log('sequelize sync')
      return sequelize;
   },
}];