import { Body, Controller, Post } from '@nestjs/common';
import { SendMailDto } from './dto/mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ) {}

    @Post()
    sendMail(@Body() newMail: SendMailDto) {
        return this.mailService.sendMail(newMail);
    }
}