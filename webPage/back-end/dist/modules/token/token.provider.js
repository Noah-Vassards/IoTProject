"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenProviders = void 0;
const constants_1 = require("../../core/constants");
const token_entity_1 = require("./token.entity");
exports.tokenProviders = [{
        provide: constants_1.TOKEN_REPOSITORY,
        useValue: token_entity_1.Token,
    }];
//# sourceMappingURL=token.provider.js.map