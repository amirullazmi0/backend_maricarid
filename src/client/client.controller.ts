import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientService } from './client.service';
import { WebResponse } from 'src/model/web.model';
import { clientCreateRequest, clientResponse } from 'src/model/client.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('/api/client')
export class ClientController {
    constructor(
        private clientService: ClientService
    ) { }

    @Get()
    async get(
        @Query('id') id?: any
    ): Promise<WebResponse<clientResponse>> {
        return await this.clientService.findAll(id)
    }

    @Post()
    @UseInterceptors(FileInterceptor('images'))
    async createClient(
        // @Auth() user: user,
        @Body() req: clientCreateRequest,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) images?: Express.Multer.File,
    ): Promise<WebResponse<any>> {

        return await this.clientService.createEvent(req, images)
    }
}
