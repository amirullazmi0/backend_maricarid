import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('/api/mail')
export class MailController {
    constructor(
        private mailService: MailService
    ) { }

    @Post('send')
    async sendMail(
        @Body('subject') subject: string,
        @Body('message') message: string
    ) {
        return this.mailService.sendUserConfirmation(subject, message)
    }
}
