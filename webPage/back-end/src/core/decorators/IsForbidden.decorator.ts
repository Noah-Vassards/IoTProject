import { registerDecorator, ValidationOptions, ValidationArguments, } from 'class-validator';

// Custom validator that fails if property is present
export function IsForbidden(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isForbidden',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // Return false if the property exists, meaning validation should fail
                    console.log('forbidden')
                    return value === undefined || value === null;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} is forbidden and should not be provided.`;
                },
            },
        });
    };
}
