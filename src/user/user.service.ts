import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { authLoginRequest, authRegisterRequest, authResponse } from 'src/model/auth.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import * as bcrypt from "bcrypt";
import path from 'path';
import { JwtService } from '@nestjs/jwt';

const AuthSchema = z.object({
    email: z.string(),
    fullName: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    token: z.string().max(1000).optional()
})

const AuthLoginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1)
})

const AuthUpdateSchema = z.object({
    email: z.string(),
    fullName: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
    token: z.string().max(1000).optional()
})

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(req: authRegisterRequest): Promise<WebResponse<authResponse>> {
        try {
            let { email, fullName, password } = req

            let validate = AuthSchema.parse({
                email: email,
                fullName: fullName,
                password: password
            })

            validate.password = await bcrypt.hash(password, 10)

            const isUnique = await this.prismaService.user.findUnique({
                where: { email: email }
            })

            if (isUnique) {
                throw new HttpException({
                    success: false,
                    path: 'email',
                    message: `user with email ${email} already exist`
                }, HttpStatus.BAD_REQUEST)
            }

            const registerUser = await this.prismaService.user.create({
                data: {
                    email: validate.email,
                    fullName: validate.fullName,
                    password: validate.password
                }
            })

            return {
                success: true,
                message: 'register successfully',
                data: registerUser
            }
        } catch (error) {
            return {
                success: false,
                message: 'register failed',
                error: error
            }
        }
    }

    async login(req: authLoginRequest): Promise<WebResponse<authResponse>> {

        try {
            let { email, password } = req

            const validate = AuthLoginSchema.parse({
                email: email,
                password: password

            })

            let user = await this.prismaService.user.findFirst({
                where: { email: email }
            })


            if (!user) {
                throw new HttpException({
                    success: false,
                    message: `account not registered`
                }, HttpStatus.FORBIDDEN)
            }

            const isPasswordValid = await bcrypt.compare(validate.password, user.password)


            if (!isPasswordValid) {
                throw new HttpException({
                    success: false,
                    path: `password`,
                    message: `password is invalid`
                }, HttpStatus.UNAUTHORIZED)
            }

            const access_token = await this.jwtService.signAsync({
                email: user.email,
                fullName: user.fullName
            })

            user = await this.prismaService.user.update({
                where: { email: validate.email },
                data: {
                    token: access_token
                }
            })

            return {
                success: true,
                message: 'login succesfully',
                data: {
                    email: user.email,
                    fullName: user.fullName,
                    token: access_token
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'login failed',
                error: error
            }
        }
    }
}
