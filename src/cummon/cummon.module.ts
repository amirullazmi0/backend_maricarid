import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as winston from 'winston';

@Global()
@Module({
    imports: [
        PrismaModule,
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()]
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        JwtModule.register({
            global: true,
            secret: 'mysecret-rsaa',
            signOptions: {
                expiresIn: '1h'
            }
        }),
        HttpModule
    ],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class CummonModule { }
