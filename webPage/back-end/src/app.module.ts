import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ComponentsModule } from './modules/components/components.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // make the .env properties available throughout the application
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ComponentsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule { }