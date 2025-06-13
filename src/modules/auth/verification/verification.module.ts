import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { SessionModule } from '../session/session.module';
import { BcryptService } from '@/src/shared/bcrypt.service';
import { EmailService } from '@/src/core/modules/notifications/email.service';
import { TokenService } from '@/src/shared/token.service';

@Module({
  imports: [SessionModule],
  providers: [
    VerificationResolver,
    VerificationService,
    BcryptService,
    EmailService,
    TokenService
  ],
  exports: [VerificationService]
})
export class VerificationModule { }
