import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import { authRegisterRequest, authResponse } from 'src/model/auth.model';

@Controller('/api/auth')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('/register')
    async register(
        @Body() req: authRegisterRequest
    ): Promise<WebResponse<authResponse>> {
        return await this.userService.register(req)
    }
}
