import { TokenType } from '@/prisma/generated/client';
import { EmailService, MailPurpose } from '@/src/core/modules/notifications/email.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from 'express-session';
import { SessionService } from '../session/session.service';
import { TokenService } from '@/src/shared/token.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';

@Injectable()
export class VerificationService {

    constructor(
        private readonly emailService: EmailService,
        private readonly sessionService: SessionService,
        private readonly tokenService: TokenService,
        private readonly prismaService: PrismaService
    ) { }


    async verifyAccount(token: string, session: Session, metadata: any) {
        const existingToken = await this.tokenService.verifyToken(token, TokenType.EMAIL_VERIFICATION);

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isEmailVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.EMAIL_VERIFICATION
            }
        })

        await this.sessionService.saveSession(session, metadata, user.id);
        return true;
    }

    async sendVerificationEmail(email: string, userId: string) {
        const verificationToken = await this.tokenService.generateToken(userId, TokenType.EMAIL_VERIFICATION, true);
        await this.emailService.sendConfirmationEmail(email, verificationToken.token, MailPurpose.ACTIVATION);
    }

}
