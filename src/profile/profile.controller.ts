import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { WebResponse } from 'src/model/web.model';
import { profileCreateRequest, profileResponse } from 'src/model/profile.model';

@Controller('/api/profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService
    ) { }

    @Get()
    async getAll(
        @Query('name') name?: string
    ): Promise<WebResponse<profileResponse>> {
        return await this.profileService.findAll(name)
    }

    @Post()
    async create(
        @Body() req?: profileCreateRequest
    ): Promise<WebResponse<profileResponse>> {
        return await this.profileService.createProfile(req)
    }
}
