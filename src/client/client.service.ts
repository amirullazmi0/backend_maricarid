import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { clientCreateRequest, clientResponse } from 'src/model/client.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import * as mime from 'mime-types';
import path from 'path';
const fs = require('fs');

const ClientSchema = z.object({
    id: z.string(),
    name: z.string().max(100).min(1),
    desc: z.string().max(1000).optional(),
    images: z.any().optional()
});

const ClientUpdateSchema = z.object({
    id: z.string(),
    name: z.string().max(100).min(1).optional(),
    desc: z.string().max(1000).optional(),
    images: z.any().optional()
});

@Injectable()
export class ClientService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService
    ) { }

    async findAll(id?: string): Promise<WebResponse<clientResponse | any>> {
        try {
            let client = null
            if (id && id.length > 0) {
                client = await this.prismaService.client.findFirst({
                    where: {
                        id: id
                    }
                })
            } else {
                client = await this.prismaService.client.findMany({
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            }

            return {
                success: true,
                message: 'get data successfully',
                record: client.length,
                data: client
            }
        } catch (error) {
            return {
                success: false,
                message: 'get data failed',
                error: error
            }
        }
    }

    async createEvent(req: clientCreateRequest, images?: Express.Multer.File): Promise<WebResponse<clientResponse | any>> {
        try {
            const baseUrl = this.configService.get('BaseURL')
            const path = '/file/client/'
            let { name, desc } = req

            let id = randomUUID()

            let dataImages = ''
            let nameImages = ''

            if (images) {
                const mimeType = mime.lookup(images.originalname);
                if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
                    return {
                        success: false,
                        message: 'create data failed',
                        error: 'files must have images extensions [jpg, jpeg, png]'
                    }
                }
                const date = new Date

                dataImages = (baseUrl + path + 'EV' + date.getTime() + '.' + mime.extension(images.mimetype))
                nameImages = ('EV' + date.getTime() + '.' + mime.extension(images.mimetype))
            }

            const validate = ClientSchema.parse({
                id: id,
                name: name,
                desc: desc,
                images: dataImages
            })

            const craeteEvent = await this.prismaService.client.create({
                data: {
                    id: validate.id,
                    name: validate.name,
                    desc: validate.desc,
                    images: validate.images
                }
            })


            if (images) {
                try {
                    const fileName = await this.saveFile(images, nameImages, './public/file/client');
                    console.log(`File ${fileName} saved successfully.`);
                } catch (error) {
                    console.error('Failed to save file:', error);
                }
            }

            return {
                success: true,
                message: 'create data successfully',
                data: craeteEvent
            }
        } catch (error) {
            return {
                success: false,
                message: 'create data failed',
                error: error
            }
        }
    }

    async saveFile(file: Express.Multer.File, name: string, folderPath: string): Promise<string> {
        try {
            const fileName = name;

            await fs.promises.writeFile(`${folderPath}/${fileName}`, file.buffer);

            return fileName;
        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Failed to save file');
        }
    }
}
