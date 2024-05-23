import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ClientService } from './client.service';
import { WebResponse } from 'src/model/web.model';
import { clientCreateRequest, clientResponse, clientUpdateRequest } from 'src/model/client.model';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('/api/client')
export class ClientController {
    constructor(
        private clientService: ClientService
    ) { }

    @Get()
    async get(
        @Query('id') id?: string
    ): Promise<WebResponse<clientResponse>> {
        return await this.clientService.findAll(id)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createClient(
        @Auth() user: user,
        @Body() req: clientCreateRequest,
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) images?: Array<Express.Multer.File>,
    ): Promise<WebResponse<any>> {
        return await this.clientService.createClient(req, images)
    }

    @Put(`/:id`)
    @UseInterceptors(FilesInterceptor('images'))
    async updateClient(
        @Auth() user: user,
        @Param('id') id: string,
        @Body() req: clientUpdateRequest,
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) images?: Array<Express.Multer.File>,
    ): Promise<WebResponse<any>> {
        return await this.clientService.updateClient(id, req, images)
    }

    @Delete()
    async deleteClient(
        @Auth() user: user,
        @Body('id') id: string
    ) {
        return await this.clientService.deleteClient(id)
    }
}
