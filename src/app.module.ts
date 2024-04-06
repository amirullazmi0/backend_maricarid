import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { SocmedModule } from './socmed/socmed.module';
import { ProfileModule } from './profile/profile.module';
import { CummonModule } from './cummon/cummon.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, EventModule, SocmedModule, ProfileModule, CummonModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
