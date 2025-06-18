import { Module } from '@nestjs/common';
import { PassRecoveryService } from './pass-recovery.service';
import { PassRecoveryResolver } from './pass-recovery.resolver';
import { EmailService } from '@/src/core/modules/notifications/email.service';
import { TokenService } from '@/src/shared/token.service';
import { TelegramService } from '../../telegram/telegram.service';

@Module({
  providers: [PassRecoveryResolver, PassRecoveryService, EmailService, TokenService, TelegramService],
})
export class PassRecoveryModule { }
