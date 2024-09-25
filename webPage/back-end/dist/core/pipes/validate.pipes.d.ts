import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
export declare class ValidateInputPipe extends ValidationPipe {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    private handleError;
}
export declare class CustomBadRequestException extends BadRequestException {
    constructor(message?: string | object | any, error?: string);
}
