import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { ProfileModule } from './profile/profile.module';
import { CummonModule } from './cummon/cummon.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocmedModule } from './socmed/socmed.module';
import { ClientModule } from './client/client.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    UserModule, EventModule, SocmedModule, ProfileModule, CummonModule, PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      exclude: ['/api/(.*)'],
    }),
    ClientModule,
    MailModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
