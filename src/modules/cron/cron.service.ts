import { EmailService, MailPurpose } from '@/src/core/modules/notifications/email.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from '../telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';
import { StorageService } from '@/src/core/modules/storage/storage.service';

@Injectable()
export class CronService {
    constructor(
        private readonly emailService: EmailService,
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
        private readonly telegramService: TelegramService,
        private readonly notificationService: NotificationService
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteDeactivatedAccounts() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const deactivatedAccounts = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo
                }
            },
            include: {
                notificationSettings: true,
                stream: true
            }
        })

        for (const account of deactivatedAccounts) {
            await this.emailService.sendEmail(account.email, account.id, MailPurpose.DELETE_ACCOUNT);
            if (account.notificationSettings?.telegramNotification) {
                await this.telegramService.sendAccountDeletion(account.id);
            }
            if (account.avatar) {
                await this.storageService.deleteFile(account.avatar);
            }
            if (account.stream?.thumbnailUrl) {
                await this.storageService.deleteFile(account.stream.thumbnailUrl);
            }
        }

        await this.prismaService.user.deleteMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo
                }
            }
        })
    }

    @Cron(CronExpression.EVERY_WEEK)
    async notifyUserEnableTwoFactor() {
        const users = await this.prismaService.user.findMany({
            where: {
                isTotpEnabled: false
            },
            include: {
                notificationSettings: true
            }
        })

        for (const user of users) {
            await this.emailService.sendEmail(user.email, user.id, MailPurpose.ENABLE_TWO_FACTOR);

            if (user.notificationSettings?.siteNotification) {
                await this.notificationService.createNotificationEnableTwoFactor(user.id);
            }
            if (user.notificationSettings?.telegramNotification && user.telegramId) {
                await this.telegramService.sendEnableTwoFactor(user.telegramId);
            }
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async notifyUserVerifiedAccount() {
        const users = await this.prismaService.user.findMany({
            include: {
                notificationSettings: true
            }
        })

        for (const user of users) {
            const followersCount = await this.prismaService.follow.count({
                where: {
                    followingId: user.id
                }
            })

            if (followersCount > 10 && !user.isVerified) {
                await this.prismaService.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        isVerified: true
                    }
                })

                await this.emailService.sendEmail(user.email, user.id, MailPurpose.VERIFIED_ACCOUNT);

                if (user.notificationSettings?.siteNotification) {
                    await this.notificationService.createNotificationVerifiedAccount(user.id, user);
                }
                if (user.notificationSettings?.telegramNotification && user.telegramId) {
                    await this.telegramService.sendVerifyChannel(user.telegramId);
                }
            }
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteAllNotifications() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        await this.prismaService.notification.deleteMany({
            where: {
                createdAt: {
                    lte: sevenDaysAgo
                }
            }
        })
    }
}
