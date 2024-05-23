import { Injectable } from '@nestjs/common';
import { profile } from '@prisma/client';
import { log } from 'console';
import { profileCreateRequest, profileResponse, profileUpdateRequest, visiMisiRequest } from 'src/model/profile.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const ProfileSchema = z.object({
    name: z.string().min(1).max(100),
    desc: z.string().max(1000).optional()
})
const ProfileUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
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
                message: 'create data failed',
                error: error
            }
        }

    }


    async updateProfile(name: string, req: profileUpdateRequest): Promise<WebResponse<profileResponse | any>> {
        try {
            let profile: profile | any = null

            profile = await this.prismaService.profile.findFirst({
                where: { name: name }
            })

            console.log('profile', profile);
            console.log('req', req);


            if (!profile) {
                return {
                    success: false,
                    message: 'get data failed',
                    error: `data profile with name ${name} not found`
                }
            }

            const validate = ProfileUpdateSchema.parse({
                name: req.name,
                desc: req.desc
            })

            if (validate.name && validate.name.length > 0 && name !== validate.name) {
                const profile = await this.prismaService.profile.findUnique({
                    where: { name: validate.name }
                })
                if (profile) {
                    return {
                        success: false,
                        message: 'craete data failed',
                        error: {
                            path: 'name',
                            message: `profile with name ${validate.name} has added`
                        }
                    }
                }
            }

            const updateProfile = await this.prismaService.profile.update({
                where: { name: name },
                data: {
                    name: validate.name ? validate.name : name,
                    desc: validate.desc
                }
            })

            console.log('update', updateProfile);

            return {
                success: true,
                message: 'update data succesfully',
                data: updateProfile
            }
        } catch (error) {
            return {
                success: false,
                message: 'update data failed',
                error: error
            }
        }

    }

    async updateVisiMisi(req: visiMisiRequest): Promise<WebResponse<profileResponse | any>> {
        try {
            const { descVisi, descMisi } = req

            let update: profile

            update = await this.prismaService.profile.update({
                where: { name: 'visi' },
                data: {
                    desc: descVisi
                }
            })

            update = await this.prismaService.profile.update({
                where: { name: 'misi' },
                data: {
                    desc: descMisi
                }
            })


            return {
                success: true,
                message: 'update visi & misi successfully',
            }
        } catch (error) {

        }
    }

    async deleteProfile(name: string): Promise<WebResponse<profileResponse | any>> {
        try {
            let profile = await this.prismaService.profile.findFirst({
                where: { name: name }
            })

            if (!profile) {
                return {
                    success: false,
                    message: 'delete data failed',
                    error: 'date not found'
                }
            }

            profile = await this.prismaService.profile.delete({
                where: { name: name },
            })

            console.log(profile);

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
