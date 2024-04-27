import { Module } from '@nestjs/common';
import { SocmedController } from './socmed.controller';
import { SocmedService } from './socmed.service';

@Module({
  controllers: [SocmedController],
  providers: [SocmedService]
})
export class SocmedModule { }
