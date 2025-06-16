import { TokenType, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { TokenService } from '@/src/shared/token.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { Session } from 'express-session';
import { EmailService, MailPurpose } from '@/src/core/modules/notifications/email.service';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { BcryptService } from '@/src/shared/bcrypt.service';
import { TotpService } from '../totp/totp.service';

@Injectable()
export class DeactivateService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly bcryptService: BcryptService,
    private readonly totpService: TotpService
  ) { }


  async validateDeactivateToken(token: string, session: Session): Promise<void> {
    const existingToken = await this.tokenService.verifyToken(token, TokenType.DEACTIVATE_ACCOUNT);

    if (!existingToken) {
      throw new BadRequestException('Invalid deactivate token');
    }
    await this.prismaService.user.update({
      where: {
        id: existingToken.userId
      },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date()
      }
    })

    await this.prismaService.token.delete({
      where: { id: existingToken.id, type: TokenType.DEACTIVATE_ACCOUNT }
    })

    await this.sessionService.destroySession(session);
  }

  async sendDeactivateAccountEmail(email: string, userId: string) {
    const deactivateToken = await this.tokenService.generateToken(userId, TokenType.DEACTIVATE_ACCOUNT);
    await this.emailService.sendConfirmationEmail(email, deactivateToken.token, MailPurpose.DEACTIVATE_ACCOUNT);
  }

  async deactivateAccount(input: DeactivateAccountInput, user: User, session: Session): Promise<boolean> {
    const { email, password, totpPin } = input;

    if (email !== user.email) {
      throw new BadRequestException('Invalid email');
    }

    const isValidPassword = await this.bcryptService.checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }

    if (!totpPin) {
      await this.sendDeactivateAccountEmail(user.email, user.id);
      return false;
    }

    await this.validateDeactivateToken(totpPin!, session);

    return true;

  }
}
