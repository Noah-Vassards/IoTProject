export declare class CreateComponentDto {
    readonly uuid: string;
    readonly name: string;
    readonly data: {
        date: Date;
        temperature: number;
        humidity: number;
    };
}
