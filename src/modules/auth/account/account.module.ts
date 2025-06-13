import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { BcryptService } from '../../../shared/bcrypt.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '@/src/core/modules/notifications/email.service';
import { TokenService } from '@/src/shared/token.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  providers: [
    AccountResolver,
    AccountService,
    BcryptService,
    VerificationService,
    EmailService,
    TokenService,
  ],
})
export class AccountModule { }
