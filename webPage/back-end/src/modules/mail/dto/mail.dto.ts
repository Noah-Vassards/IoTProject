import { IsNotEmpty, IsEmpty } from 'class-validator';

export class SendMailDto {
    @IsNotEmpty()
    address: string[];

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    from: string;

    @IsNotEmpty()
    text: string;
}