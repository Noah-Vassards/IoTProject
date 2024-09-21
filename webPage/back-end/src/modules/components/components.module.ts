import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { componentProviders } from './component.provider';
import { ComponentsController } from './components.controller';

@Module({
    providers: [ComponentsService, ...componentProviders, ],
    exports: [ComponentsService],
    controllers: [ComponentsController]
})
export class ComponentsModule {}
