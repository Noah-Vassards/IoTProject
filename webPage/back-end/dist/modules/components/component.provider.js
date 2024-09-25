"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentProviders = void 0;
const constants_1 = require("../../core/constants");
const component_entity_1 = require("./component.entity");
exports.componentProviders = [{
        provide: constants_1.COMPONENT_REPOSITORY,
        useValue: component_entity_1.Component,
    }];
//# sourceMappingURL=component.provider.js.map