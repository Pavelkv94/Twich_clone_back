import { NotificationType, SponsorshipPlan, TokenType, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationSettingsInput } from './inputs/notification-settings.input';
import { TokenService } from '@/src/shared/token.service';

@Injectable()
export class NotificationService {

    constructor(private readonly prismaService: PrismaService, private readonly tokenService: TokenService) { }

    async findUnreadNotificationsCount(user: User) {
        const count = await this.prismaService.notification.count({
            where: {
                user: {
                    id: user.id
                },
                isRead: false
            }
        })

        return count;
    }

    async findNotificationsByUser(user: User) {
        //read all unread notifications
        await this.prismaService.notification.updateMany({
            where: {
                isRead: false,
                userId: user.id
            },
            data: {
                isRead: true
            }
        })

        const notifications = await this.prismaService.notification.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return notifications;
    }

    async updateNotificationSettings(user: User, settings: NotificationSettingsInput) {
        const { siteNotification, telegramNotification } = settings;

        //todo instead upsert use update and in db seeder create notification settings with user
        const notificationSettings = await this.prismaService.notificationSettings.upsert({
            where: {
                userId: user.id
            },
            create: {
                siteNotification,
                telegramNotification,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            },
            update: {
                siteNotification,
                telegramNotification
            },
            include: {
                user: true
            }
        })

        if (notificationSettings.telegramNotification && !user.telegramId) {
            const telegramAuthToken = await this.tokenService.generateToken(user.id, TokenType.TELEGRAM_AUTH)

            return {
                notificationSettings,
                telegramAuthToken: telegramAuthToken.token
            }

        }
        if (!notificationSettings.telegramNotification && user.telegramId) {
            await this.prismaService.user.update({
                where: { id: user.id },
                data: { telegramId: null }
            })
            return { notificationSettings };
        }

        return { notificationSettings };
    }

    async createNotificationStreamStarted(userId: string, channel: User) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `
                <b>Stream started on ${channel.username}</b>
                <a href="/${channel.username}">Open stream</a>
                `,
                type: NotificationType.STREAM_STARTED,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification;
    }
    async createNotificationNewFollower(userId: string, follower: User) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `
                <b>New follower: ${follower.username}</b>
                <a href="/${follower.username}">Open profile</a>
                `,
                type: NotificationType.NEW_FOLLOWER,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification;
    }

    async createNewSponsorship(userId: string, plan: SponsorshipPlan, sponsor: User) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `New sponsorship: ${plan.title} by ${sponsor.username}`,
                type: NotificationType.NEW_SPONSORSHIP,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification;
    }

    async createNotificationVerifiedAccount(userId: string, channel: User) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `Your account was verified! Congratulations!`,
                type: NotificationType.VERIFIED_CHANNEL,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification;
    }

    async createNotificationEnableTwoFactor(userId: string) {
        const notification = await this.prismaService.notification.create({
            data: {
                message: `Enable two-factor authentication`,
                type: NotificationType.ENABLE_TWO_FACTOR_AUTH,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return notification;
    }
}
