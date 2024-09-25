export declare class UpdateComponentDto {
    readonly uuid: string;
    readonly name: string;
    readonly data: {
        date: Date;
        temperature: number;
        humidity: number;
    }[];
}
