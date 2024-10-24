import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SendMailDto } from './dto/mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async sendMail(newMail: SendMailDto) {
        try {
            console.log("try")
            await this.mailerService.sendMail({

                to: newMail.address,
                subject: newMail.subject,

                template: 'template',
                context: {
                    text: newMail.text,
                    from: newMail.from,
                }
            });
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException('Error sending mail');
        }
    }
}