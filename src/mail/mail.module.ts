import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'mail.maricar.id',
    //     auth: {
    //       user: 'noreplay@maricar.id',
    //       pass: 'maricar24',
    //     },
    //   },
    // }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }
