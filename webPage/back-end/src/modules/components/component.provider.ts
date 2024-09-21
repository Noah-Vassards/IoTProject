import { COMPONENT_REPOSITORY } from '../../core/constants';
import { Component } from './component.entity';

export const componentProviders = [{
    provide: COMPONENT_REPOSITORY,
    useValue: Component,
}];