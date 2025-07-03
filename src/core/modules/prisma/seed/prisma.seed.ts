import { BadRequestException, Logger } from "@nestjs/common";
import { Prisma, PrismaClient } from "../../../../../prisma/generated";
import { categoriesSeedData, categoriesTopicsData } from "./categories.data";
import { usernamesSeedData } from "./usernames.data";
import * as bcrypt from 'bcrypt';

async function seed() {
    const prisma = new PrismaClient({
        transactionOptions: {
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
    });

    try {

        Logger.log('Seeding database');

        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.socialLink.deleteMany(),
            prisma.stream.deleteMany(),
            prisma.category.deleteMany(),
        ])

        await prisma.category.createMany({
            data: categoriesSeedData,
        })

        Logger.log('Seeded categories');

        const categories = await prisma.category.findMany();

        const categoriesBySlug = Object.fromEntries(categories.map(category => [category.slug, category]));

        await prisma.$transaction(async tx => {
            for (const username of usernamesSeedData) {
                const randomCategory = categoriesBySlug[Object.keys(categoriesBySlug)[Math.floor(Math.random() * Object.keys(categoriesBySlug).length)]];
                const randomTitles = categoriesTopicsData[randomCategory.slug];

                const userExists = await tx.user.findUnique({
                    where: {
                        username,
                    },
                })

                if (!userExists) {
                    const createdUser = await tx.user.create({
                        data: {
                            username: username,
                            email: `${username.toLowerCase()}@example.com`,
                            password: await bcrypt.hash(username, 10),
                            displayName: username,
                            avatar: `channels/${username}.webp`,
                            bio: `I am ${username} and I love ${randomTitles[Math.floor(Math.random() * randomTitles.length)]}`,
                            isVerified: Math.random() > 0.5,
                            isEmailVerified: true,
                            socialLinks: {
                                createMany: {
                                    data: [
                                        {
                                            title: 'Telegram',
                                            url: `https://t.me/${username}`,
                                            position: 1
                                        },
                                        {
                                            title: 'Instagram',
                                            url: `https://www.instagram.com/${username}`,
                                            position: 2
                                        },


                                    ]
                                },
                            },
                            notificationSettings: {
                                create: {
                                    siteNotification: true,
                                    telegramNotification: true,
                                }
                            }
                        },
                    })

                    const randomUserTitles = categoriesTopicsData[randomCategory.slug];
                    const randomTitle = randomUserTitles[Math.floor(Math.random() * randomTitles.length)];

                    await tx.stream.create({
                        data: {
                            title: randomTitle,
                            thumbnailUrl: `streams/${createdUser.username}-${randomCategory.slug}.webp`,
                            user: {
                                connect: {
                                    id: createdUser.id,
                                }
                            },
                            category: {
                                connect: {
                                    id: randomCategory.id,
                                }
                            }
                        },
                    })


                    Logger.log(`Created user ${username} with stream ${randomTitle}`);
                }
            }

        })


        Logger.log('Seeded all data');

    } catch (error) {
        Logger.error(error);
        throw new BadRequestException(error);
    } finally {
        Logger.log('Disconnecting from database');
        await prisma.$disconnect();
        Logger.log('Disconnected from database');

    }
}

seed();