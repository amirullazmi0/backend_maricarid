import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.createMany({
        data: [
            {
                email: `maricar@gmail.com`,
                fullName: 'MARICAR',
                password: await bcrypt.hash('12345', 10)

            },
            {
                email: `amirullazmi0@gmail.com`,
                fullName: 'amirullazmi',
                password: await bcrypt.hash('12345', 10)

            },
        ]
    })

    // const event = await prisma.event.createMany({
    //     data: [
    //         {
    //             id: randomUUID(),
    //             name: 'this event 1',
    //             desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //         },
    //         {
    //             id: randomUUID(),
    //             name: 'this event 2',
    //             desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //         },
    //         {
    //             id: randomUUID(),
    //             name: 'this event 3',
    //             desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //         },
    //     ],
    //     skipDuplicates: true,
    // })

    const socmed = await prisma.socmed.createMany({
        data: [
            {
                name: 'facebook',
                link: 'https://www.facebook.com/'
            },
            {
                name: 'instagram',
                link: 'https://www.instagram.com/'
            },
            {
                name: 'twitter',
                link: 'https://x.com'
            },
            {
                name: 'email',
                link: 'https://google.com'
            },
            {
                name: 'phone',
                link: '0899123912398'
            },
        ],
        skipDuplicates: true,
    })
    const profile = await prisma.profile.createMany({
        data: [
            {
                name: 'phone',
                desc: '0899123912398'
            },
            {
                name: 'visi',
                desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.'
            },
            {
                name: 'misi',
                desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries.'
            },
            {
                name: 'aboutus',
                desc: 'Maricar Id is compopany Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'
            },
            {
                name: 'contactus',
                desc: '-'
            },
            {
                name: 'founder',
                desc: 'David Anderson'
            },
            {
                name: 'address',
                desc: 'Pontianak, Indonesia'
            },
        ],
        skipDuplicates: true,
    })

    return { user, socmed, profile }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })