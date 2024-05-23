import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EventService } from './event.service';
import { eventCreateRequest, eventResponse, eventUpdateRequest } from 'src/model/event.model';
import { WebResponse } from 'src/model/web.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('/api/event')
export class EventController {
    constructor(
        private eventService: EventService
    ) { }

    @Get()
    async get(
        @Query('id') id?: string
    ) {
        return await this.eventService.findAll(id)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createEvent(
        @Auth() user: user,
        @Body() req: eventCreateRequest,
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) images?: Array<Express.Multer.File>,
    ): Promise<any> {

        return await this.eventService.createEvent(req, images)
    }

    @Put('/:id')
    @UseInterceptors(FilesInterceptor('images'))
    async updateEvent(
        @Auth() user: user,
        @Param('id') id: string,
        @Body() req: eventUpdateRequest,
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) images?: Array<Express.Multer.File>,
    ): Promise<any> {
        return await this.eventService.updateEvent(id, req, images)
    }

    @Delete()
    async deleteEvent(
        @Auth() user: user,
        @Body('id') id: string
    ) {
        return await this.eventService.deleteEvent(id)
    }
}
