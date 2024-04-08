import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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

    @Put('/:name')
    async update(
        @Param('name') name: string,
        @Body() req?: profileCreateRequest
    ): Promise<WebResponse<profileResponse>> {
        return await this.profileService.updateProfile(name, req)
    }

    @Delete()
    async delete(
        @Body('name') name: string
    ) {
        return await this.profileService.deleteProfile(name)
    }
}
