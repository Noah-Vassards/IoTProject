"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsForbidden = void 0;
const class_validator_1 = require("class-validator");
function IsForbidden(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isForbidden',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    console.log('forbidden');
                    return value === undefined || value === null;
                },
                defaultMessage(args) {
                    return `${args.property} is forbidden and should not be provided.`;
                },
            },
        });
    };
}
exports.IsForbidden = IsForbidden;
//# sourceMappingURL=IsForbidden.decorator.js.map