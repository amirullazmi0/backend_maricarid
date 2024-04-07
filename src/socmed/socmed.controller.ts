import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SocmedService } from './socmed.service';
import { WebResponse } from 'src/model/web.model';
import { socmedCreateRequest, socmedResponse, socmedUpdateRequest } from 'src/model/socmed.model';

@Controller('/api/socmed')
export class SocmedController {
    constructor(
        private socmedService: SocmedService
    ) { }

    @Get()
    async getAll(): Promise<WebResponse<socmedResponse>> {
        return await this.socmedService.findAll()
    }

    @Post()
    async create(
        @Body() req: socmedCreateRequest
    ): Promise<WebResponse<socmedResponse>> {
        return await this.socmedService.create(req)
    }

    @Put('/:name')
    async upate(
        @Param('name') name: string,
        @Body() req: socmedUpdateRequest
    ): Promise<WebResponse<socmedResponse>> {
        return await this.socmedService.update(name, req)
    }

    @Delete()
    async deleteEvent(
        @Body('name') name: string
    ) {
        return await this.socmedService.delete(name)
    }
}
