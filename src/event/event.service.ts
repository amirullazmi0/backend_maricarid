import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eventCreateRequest, eventResponse, eventUpdateRequest } from 'src/model/event.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import * as mime from 'mime-types';

const EventSchema = z.object({
    id: z.string(),
    name: z.string().max(100).min(1),
    desc: z.string().max(1000).optional(),
    images: z.any().optional()
});

const EventUpdateSchema = z.object({
    id: z.string(),
    name: z.string().max(100).min(1).optional(),
    desc: z.string().max(1000).optional(),
    images: z.any().optional()
});



@Injectable()
export class EventService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async findAll(): Promise<WebResponse<eventResponse | any>> {
        try {
            const event = await this.prismaService.event.findMany()
            return {
                success: true,
                message: 'get data successfully',
                record: event.length,
                data: event
            }
        } catch (error) {
            return {
                success: false,
                message: 'get data failed',
                error: error
            }
        }
    }

    async createEvent(req: eventCreateRequest, images?: Array<Express.Multer.File>): Promise<WebResponse<eventResponse | any>> {
        try {
            let { name, desc } = req

            let id = randomUUID()

            let dataImages = []

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
                    const imagesName = 'EV' + i + date.getTime() + '.' + mime.extension(images[i].mimetype);

                    dataImages.push(imagesName)
                }
            }

            const validate = EventSchema.parse({
                id: id,
                name: name,
                desc: desc,
                images: dataImages
            })

            const craeteEvent = await this.prismaService.event.create({
                data: {
                    id: validate.id,
                    name: validate.name,
                    desc: validate.desc,
                    images: validate.images
                }
            })

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

    async updateEvent(id: string, req: eventUpdateRequest, images?: Array<Express.Multer.File>): Promise<WebResponse<eventResponse | any>> {
        try {
            const event = await this.prismaService.event.findFirst({
                where: {
                    id: id
                }
            })

            if (!event) {
                return {
                    success: false,
                    message: 'craete data failed',
                    error: 'Event not found'
                }
            }

            let { name, desc } = req

            let dataImages = event.images

            if (images) {
                const dd = []
                for (let i = 0; i < images.length; i++) {
                    const mimeType = mime.lookup(images[i].originalname);
                    if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
                        return {
                            success: false,
                            message: 'craete data failed',
                            error: 'files must have images extensions [jpg, jpeg, png]'
                        }
                    }
                    const date = new Date
                    const imagesName = 'EV' + i + date.getTime() + '.' + mime.extension(images[i].mimetype);

                    dd.push(imagesName)
                }

                dataImages = dd
            }

            const validate = EventUpdateSchema.parse({
                id: id,
                name: name,
                desc: desc,
                images: dataImages
            })

            const updateEvent = await this.prismaService.event.update({
                where: {
                    id: event.id
                },
                data: {
                    name: validate.name,
                    desc: validate.desc,
                    images: validate.images.length! > 0 ? validate.images : event.images
                }
            })

            return {
                success: true,
                message: 'update data successfully',
                data: updateEvent
            }
        } catch (error) {
            return {
                success: false,
                message: 'update data failed',
                error: error
            }
        }
    }

    async deleteEvent(id: string): Promise<WebResponse<eventResponse | any>> {
        try {
            let event = await this.prismaService.event.findFirst({
                where: { id: id }
            })

            if (!event) {
                return {
                    success: false,
                    message: 'delete data failed',
                    error: 'Event not found'
                }
            }

            event = await this.prismaService.event.delete({
                where: { id: id },
            })

            console.log(event);


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