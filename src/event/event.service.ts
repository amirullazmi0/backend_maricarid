import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eventRequest, eventResponse } from 'src/model/event.model';
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

@Injectable()
export class EventService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async findAll(): Promise<WebResponse<eventResponse | any>> {
        const event = await this.prismaService.event.findMany()
        return {
            success: true,
            message: 'get data successfully',
            record: event.length,
            data: event
        }
    }

    async createEvent(req: eventRequest, images: Array<Express.Multer.File>): Promise<WebResponse<eventResponse | any>> {
        try {
            let { id, name, desc } = req

            id = randomUUID()

            let dataImages = []

            if (images) {
                for (let i = 0; i < images.length; i++) {
                    const mimeType = mime.lookup(images[i].originalname);
                    if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
                        return {
                            success: false,
                            message: 'post data failed',
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
}
