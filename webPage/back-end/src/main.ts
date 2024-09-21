import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipes';
import * as cookieParser from 'cookie-parser';
import { DEVELOPMENT, PRODUCTION, TEST } from './core/constants';
import { databaseConfig } from './core/database/database.config';

const port = 3001

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const prefix = databaseConfig.urlDatabase;
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidateInputPipe());
  app.use(cookieParser());
  await app.listen(port);
  console.log('env:', prefix)
  console.log('Listening on port', port)
}
bootstrap();