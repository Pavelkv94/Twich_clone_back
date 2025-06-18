import { EmailService, MailPurpose } from '@/src/core/modules/notifications/email.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResetPassInput } from './inputs/reset-pass.input';
import { TokenType } from '@/prisma/generated';
import { TokenService } from '@/src/shared/token.service';
import { NewPasswordInput } from './inputs/new-password.input';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable()
export class PassRecoveryService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService,
        private readonly tokenService: TokenService,
        private readonly telegramService: TelegramService
    ) { }

    async resetPassword(input: ResetPassInput, metadata: any) {
        const { email } = input;

        const user = await this.prismaService.user.findUnique({ where: { email }, include: { notificationSettings: true } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const resetToken = await this.tokenService.generateToken(user.id, TokenType.PASSWORD_RESET, true);

        await this.emailService.sendConfirmationEmail(email, resetToken.token, MailPurpose.PASSWORD_RECOVERY);

        if (resetToken.user.notificationSettings?.telegramNotification) {
            await this.telegramService.sendPasswordResetToken(user.id, resetToken.token);
        }

        return true
    }

    async sendPasswordRecoveryEmail(email: string, userId: string) {
        const verificationToken = await this.tokenService.generateToken(userId, TokenType.PASSWORD_RESET, true);
        await this.emailService.sendConfirmationEmail(email, verificationToken.token, MailPurpose.PASSWORD_RECOVERY);
    }

    async setNewPassword(input: NewPasswordInput) {
        const { password, token } = input;

        const existingToken = await this.tokenService.verifyToken(token, TokenType.PASSWORD_RESET);

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                password: password
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true;

    }

}
