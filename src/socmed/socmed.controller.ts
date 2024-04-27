import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SocmedService } from './socmed.service';
import { WebResponse } from 'src/model/web.model';
import { socmedCreateRequest, socmedResponse, socmedUpdateRequest } from 'src/model/socmed.model';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('/api/socmed')
export class SocmedController {
    constructor(
        private socmedService: SocmedService
    ) { }

    @Get()
    async getAll(
        @Query('name') name?: string
    ): Promise<WebResponse<socmedResponse>> {
        return await this.socmedService.findAll(name)
    }

    @Post()
    async create(
        @Auth() user: user,
        @Body() req: socmedCreateRequest
    ): Promise<WebResponse<socmedResponse>> {
        return await this.socmedService.create(req)
    }

    @Put('/:name')
    async upate(
        @Auth() user: user,
        @Param('name') name: string,
        @Body() req: socmedUpdateRequest
    ): Promise<WebResponse<socmedResponse>> {
        return await this.socmedService.update(name, req)
    }

    @Delete()
    async deleteEvent(
        @Auth() user: user,
        @Body('name') name: string
    ) {
        return await this.socmedService.delete(name)
    }
}
