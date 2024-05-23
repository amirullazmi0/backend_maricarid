import { Injectable } from '@nestjs/common';
import { link } from 'fs';
import { socmedCreateRequest, socmedResponse, socmedUpdateRequest } from 'src/model/socmed.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const SocmedSchema = z.object({
    name: z.string().max(100).min(1),
    link: z.string().max(250).min(1),
});

const SocmedUpdateSchema = z.object({
    name: z.string().max(100).min(1),
    link: z.string().max(250).min(1).optional(),
});

@Injectable()
export class SocmedService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async findAll(name?: string): Promise<WebResponse<socmedResponse | any>> {
        try {
            let socmed = null

            if (name && name.length > 0) {
                socmed = await this.prismaService.socmed.findFirst({
                    where: {
                        name: name
                    }
                })

                if (!socmed) {
                    return {
                        success: false,
                        message: `data not found`
                    }
                }

            } else {

                socmed = await this.prismaService.socmed.findMany()
            }
            return {
                success: true,
                message: 'get data successfully',
                record: socmed.length,
                data: socmed
            }
        } catch (error) {
            return {
                success: false,
                message: 'get data failed',
                error: error
            }
        }
    }

    async create(req: socmedCreateRequest): Promise<WebResponse<socmedResponse | any>> {
        try {
            let { name, link } = req

            const validate = SocmedSchema.parse({
                name: name,
                link: link
            })

            let socmed = await this.prismaService.socmed.findFirst({
                where: { name: name }
            })

            if (socmed) {
                return {
                    success: false,
                    message: 'get data failed',
                    error: `socmed with name ${name} has added`
                }
            }

            socmed = await this.prismaService.socmed.create({
                data: {
                    name: validate.name,
                    link: validate.link
                }
            })

            return {
                success: true,
                message: 'create data successfully',
                data: socmed
            }
        } catch (error) {
            return {
                success: false,
                message: 'create data failed',
                error: error
            }
        }
    }

    async update(name: string, req: socmedUpdateRequest): Promise<WebResponse<socmedResponse | any>> {
        try {
            let socmed = await this.prismaService.socmed.findFirst({
                where: { name: name }
            })

            if (!socmed) {
                return {
                    success: false,
                    message: 'get data failed',
                    error: `socmed with name ${name} not found`
                }
            }

            // if (socmed.name !== req.name) {
            //     const unique = await this.prismaService.socmed.findFirst({
            //         where: { name: req.name }
            //     })

            //     if (unique) {
            //         return {
            //             success: false,
            //             message: 'get data failed',
            //             error: `socmed with name ${unique.name} has added`
            //         }
            //     }
            // }


            console.log('validate', req);

            const validate = SocmedUpdateSchema.parse({
                name: socmed.name,
                link: req.link.length > 0 ? req.link : socmed.link
            })

            socmed == await this.prismaService.socmed.update({
                where: { name: name },
                data: {
                    link: validate.link
                }
            })

            return {
                success: true,
                message: 'update data successfully',
                data: socmed
            }
        } catch (error) {
            return {
                success: false,
                message: 'update data failed',
                error: error
            }
        }
    }

    async delete(name: string): Promise<WebResponse<socmedResponse | any>> {
        try {
            let socmed = await this.prismaService.socmed.findFirst({
                where: { name: name }
            })

            if (!socmed) {
                return {
                    success: false,
                    message: 'delete data failed',
                    error: 'socmed not found'
                }
            }

            socmed = await this.prismaService.socmed.delete({
                where: { name: name },
            })


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
