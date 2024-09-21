import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { tokenProviders } from './token.provider';

@Module({
  providers: [TokenService, ...tokenProviders],
  exports: [TokenService],
  controllers: [TokenController]
})
export class TokenModule {}