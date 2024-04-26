import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.createMany({
        data: [
            {
                email: `amirullazmi0@gmail.com`,
                fullName: 'Amirull Azmi',
                password: await bcrypt.hash('12345', 10)

            }
        ]
    })
    const event = await prisma.event.createMany({

        data: [
            {
                id: randomUUID(),
                name: 'this event 1',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
            {
                id: randomUUID(),
                name: 'this event 2',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
            {
                id: randomUUID(),
                name: 'this event 3',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
        ],
        skipDuplicates: true,
    })

    const socmed = await prisma.socmed.createMany({
        data: [
            {
                name: 'facebook',
                link: 'https://www.facebook.com/rsudaa/?locale=id_ID'
            },
            {
                name: 'instagram',
                link: 'https://www.instagram.com/rsuddr.abdulaziz/'
            },
            {
                name: 'twitter',
                link: 'https://x.com'
            },
            {
                name: 'email',
                link: 'https://google.com'
            },
        ],
        skipDuplicates: true,
    })

    return { event, socmed }
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