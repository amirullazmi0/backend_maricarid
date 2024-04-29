import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import { authLoginRequest, authRegisterRequest, authResponse, reqUpdatePassword, reqUpdateUser } from 'src/model/auth.model';
import { Response } from 'express';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('/api/auth')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('/register')
    async register(
        @Auth() user: user,
        @Body() req: authRegisterRequest
    ): Promise<WebResponse<authResponse>> {
        return await this.userService.register(req)
    }

    @Post('/login')
    async login(
        @Body() req: authLoginRequest,
        @Res({ passthrough: true }) res: Response
    ): Promise<WebResponse<authResponse>> {
        return await this.userService.login(req, res)
    }

    @Get('/checkAuth')
    async check(
        @Auth() user: user
    ): Promise<WebResponse<any>> {
        return await this.userService.checkAuth(user)
    }

    @Put('/update-password')
    async updatePassword(
        @Auth() user: user,
        @Body() req: reqUpdatePassword
    ): Promise<WebResponse<any>> {
        return await this.userService.updatePassword(user, req)
    }

    @Put('/update-user')
    async updateUser(
        @Auth() user: user,
        @Body() req: reqUpdateUser
    ): Promise<WebResponse<any>> {
        return await this.userService.updateUser(user, req)
    }
}
