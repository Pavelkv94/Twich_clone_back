import { EmailService, MailPurpose } from '@/src/core/modules/notifications/email.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { StorageService } from '@/src/core/modules/storage/storage.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
    constructor(
        private readonly emailService: EmailService,
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService
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
            }
        })

        for (const account of deactivatedAccounts) {
            await this.emailService.sendConfirmationEmail(account.email, account.id, MailPurpose.DELETE_ACCOUNT);
            if (account.avatar) {
                await this.storageService.deleteFile(account.avatar);
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
}
