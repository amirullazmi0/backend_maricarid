import { Injectable } from '@nestjs/common';
import { profile } from '@prisma/client';
import { profileCreateRequest, profileResponse } from 'src/model/profile.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const ProfileSchema = z.object({
    name: z.string().min(1).max(100),
    desc: z.string().max(1000).optional()
})

@Injectable()
export class ProfileService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async findAll(name?: string): Promise<WebResponse<profileResponse | any>> {
        try {
            let profile = null
            if (!name) {
                profile = await this.prismaService.profile.findMany()
            } else {
                profile = await this.prismaService.profile.findFirst({
                    where: { name: name }
                })

                if (!profile) {
                    return {
                        success: false,
                        message: 'get data failed',
                        error: `data profile with name ${name} not found`
                    }
                }
            }

            return {
                success: true,
                message: 'get data succesfully',
                data: profile
            }
        } catch (error) {
            return {
                success: false,
                message: 'get data failed',
                error: error
            }
        }
    }

    async createProfile(req: profileCreateRequest): Promise<WebResponse<profileResponse | any>> {
        try {
            const { name, desc } = req

            const validate = ProfileSchema.parse({
                name: name,
                desc: desc
            })

            let profile = null

            profile = await this.prismaService.profile.findUnique({
                where: { name: validate.name }
            })

            if (profile) {
                return {
                    success: false,
                    message: 'craete data failed',
                    error: {
                        path: 'name',
                        message: `profile with name ${name} has added`
                    }
                }
            }

            profile = await this.prismaService.profile.create({
                data: {
                    name: validate.name,
                    desc: validate.desc
                }
            })
            return {
                success: true,
                message: 'create data succesfully',
                data: profile
            }
        } catch (error) {
            return {
                success: true,
                message: 'create data succesfully',
                error: error
            }
        }

    }
}
