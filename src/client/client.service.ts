import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { clientCreateRequest, clientResponse, clientUpdateRequest } from 'src/model/client.model';
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

    async createClient(req: clientCreateRequest, images?: Array<Express.Multer.File>): Promise<WebResponse<clientResponse | any>> {
        try {
            const baseUrl = this.configService.get('BaseURL')
            const path = '/file/client/'
            let { name, desc } = req

            let id = randomUUID()

            let dataImages = []
            let nameImages = []


            if (images) {
                for (let i = 0; i < images.length; i++) {
                    const mimeType = mime.lookup(images[i].originalname);
                    if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
                        return {
                            success: false,
                            message: 'create data failed',
                            error: 'files must have images extensions [jpg, jpeg, png]'
                        }
                    }
                    const date = new Date

                    dataImages.push(baseUrl + path + 'CL' + i + date.getTime() + '.' + mime.extension(images[i].mimetype))
                    nameImages.push('CL' + i + date.getTime() + '.' + mime.extension(images[i].mimetype))
                }
            }

            const validate = ClientSchema.parse({
                id: id,
                name: name,
                desc: desc,
                images: dataImages
            })

            const craeteclient = await this.prismaService.client.create({
                data: {
                    id: validate.id,
                    name: validate.name,
                    desc: validate.desc,
                    images: validate.images
                }
            })

            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    try {
                        const fileName = await this.saveFile(images[i], nameImages[i], './public/file/client');
                        console.log(`File ${fileName} saved successfully.`);
                    } catch (error) {
                        console.error('Failed to save file:', error);
                    }
                }
            }

            return {
                success: true,
                message: 'create data successfully',
                data: craeteclient
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

            const save = await fs.promises.writeFile(`${folderPath}/${fileName}`, file.buffer);

            console.log(save);
            console.log('save file successfully');

            return fileName;
        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Failed to save file');
        }
    }

    async updateClient(id: string, req: clientUpdateRequest, images?: Array<Express.Multer.File>): Promise<WebResponse<clientResponse | any>> {
        try {
            const client = await this.prismaService.client.findFirst({
                where: {
                    id: id
                }
            })

            if (!client) {
                return {
                    success: false,
                    message: 'craete data failed',
                    error: 'client not found'
                }
            }

            let { name, desc } = req
            const baseUrl = this.configService.get('BaseURL')
            const path = '/file/client/'

            let dataImages = [client.images]
            let nameImages = []

            if (images) {
                for (let i = 0; i < images.length; i++) {
                    const mimeType = mime.lookup(images[i].originalname);
                    if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
                        return {
                            success: false,
                            message: 'create data failed',
                            error: 'files must have images extensions [jpg, jpeg, png]'
                        }
                    }
                    const date = new Date

                    dataImages = [(baseUrl + path + 'CL' + i + date.getTime() + '.' + mime.extension(images[i].mimetype))]
                    nameImages.push('CL' + i + date.getTime() + '.' + mime.extension(images[i].mimetype))
                }
            }



            const validate = ClientUpdateSchema.parse({
                id: id,
                name: name,
                desc: desc,
                images: dataImages
            })


            const updateclient = await this.prismaService.client.update({
                where: {
                    id: id
                },
                data: {
                    name: validate.name,
                    desc: validate.desc,
                    images: validate.images
                }
            })

            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    try {
                        const fileName = await this.saveFile(images[i], nameImages[i], './public/file/client');
                        console.log(`File ${fileName} saved successfully.`);
                    } catch (error) {
                        console.error('Failed to save file:', error);
                    }
                }
            }

            return {
                success: true,
                message: 'update data successfully',
                data: updateclient
            }
        } catch (error) {
            return {
                success: false,
                message: 'update data failed',
                error: error
            }
        }
    }

    async deleteClient(id: string): Promise<WebResponse<clientResponse | any>> {
        try {
            let client = await this.prismaService.client.findFirst({
                where: { id: id }
            })

            if (!client) {
                return {
                    success: false,
                    message: 'delete data failed',
                    error: 'client not found'
                }
            }

            client = await this.prismaService.client.delete({
                where: { id: id },
            })

            console.log(client);

            return {
                success: true,
                message: 'delete data successfully',
            }

        } catch (error) {
            return {
                success: false,
                message: 'delete data failed',
                error: error
            }
        }
    }
}
