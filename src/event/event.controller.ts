import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EventService } from './event.service';
import { eventCreateRequest, eventResponse, eventUpdateRequest } from 'src/model/event.model';
import { WebResponse } from 'src/model/web.model';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/api/event')
export class EventController {
    constructor(
        private eventService: EventService
    ) { }

    @Get()
    async get() {
        return await this.eventService.findAll()
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createEvent(
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

    @Post('/update/:id')
    @UseInterceptors(FilesInterceptor('images'))
    async updateEvent(
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

    @Post('/delete')
    async deleteEvent(
        @Body('id') id: string
    ) {
        return await this.eventService.deleteEvent(id)
    }
}
