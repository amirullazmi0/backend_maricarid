import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { authLoginRequest, authRegisterRequest, authResponse, reqUpdatePassword, reqUpdateUser } from 'src/model/auth.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import * as bcrypt from "bcrypt";
import path from 'path';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { user } from '@prisma/client';

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

const updatePasswordSchema = z.object({
    newPassword: z.string().min(1).max(100),
    confirmNewPassword: z.string().min(1).max(100),
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

    async login(req: authLoginRequest, res: Response): Promise<WebResponse<authResponse>> {

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

            const expirationTime = 7 * 24 * 60 * 60 * 1000;

            res.cookie('access-token', user.token, {
                maxAge: expirationTime,
                httpOnly: true
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

    async checkAuth(user: user): Promise<WebResponse<any>> {
        return {
            success: true,
            data: {
                email: user.email,
                fullName: user.fullName
            }
        }
    }

    async updatePassword(user: user, req: reqUpdatePassword): Promise<WebResponse<any>> {
        try {
            const validate = updatePasswordSchema.parse({
                newPassword: req.newPassword,
                confirmNewPassword: req.confirmNewPassword

            })

            if (validate.newPassword !== validate.confirmNewPassword) {
                return {
                    success: false,
                    message: 'update password failed',
                    error: {
                        path: 'password',
                        message: 'confirm password must be same with new password'
                    }
                }
            }
            const updatePassword = await this.prismaService.user.update({
                where: {
                    email: user.email
                },
                data: {
                    password: await bcrypt.hash(validate.newPassword, 10)
                }
            })

            return {
                success: true,
                message: 'update password successfully',
                data: {
                    email: updatePassword.email,
                    fullName: updatePassword.fullName
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'update password failed',
                error: error
            }
        }
    }

    async updateUser(user: user, req: reqUpdateUser): Promise<WebResponse<authResponse>> {
        try {
            const updateUser = await this.prismaService.user.update({
                where: { email: user.email },
                data: {
                    fullName: req.fullName,
                    email: req.email
                }
            })

            return {
                success: true,
                message: 'update data successfully',
                data: {
                    fullName: updateUser.fullName,
                    email: updateUser.email
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'update date failed',
                error: error
            }
        }
    }
}
