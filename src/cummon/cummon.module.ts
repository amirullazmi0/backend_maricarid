import { HttpModule } from '@nestjs/axios';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as winston from 'winston';
import { AuthMidlleware } from './auth.middleware';
import { MulterModule } from '@nestjs/platform-express';

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
            secret: 'mySecretMaricarId',
            signOptions: {
                expiresIn: '7d'
            }
        }),
        HttpModule,
        MulterModule.register({
            dest: 'file',
        })
    ],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class CummonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMidlleware).forRoutes('/api/*')
    }
}
