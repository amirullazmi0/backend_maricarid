import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private configService: ConfigService
    ) { }

    async sendUserConfirmation(subject?: string, message?: string): Promise<WebResponse<any>> {
        const sendMail = await this.mailerService.sendMail({
            from: 'noreplay@maricar.id',
            to: 'info@maricar.id',
            subject: subject ? subject : 'no-subject',
            text: message ? message : 'no-message',
        });

        return {
            success: true,
            message: 'send mail successfully',
            data: sendMail
        }
    }
}
