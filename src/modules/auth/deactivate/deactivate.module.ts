import { Module } from '@nestjs/common';
import { DeactivateService } from './deactivate.service';
import { DeactivateResolver } from './deactivate.resolver';
import { EmailService } from '@/src/core/modules/notifications/email.service';
import { TokenService } from '@/src/shared/token.service';
import { SessionService } from '../session/session.service';
import { BcryptService } from '@/src/shared/bcrypt.service';
import { TotpService } from '../totp/totp.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  providers: [DeactivateResolver, DeactivateService, EmailService, TokenService, BcryptService, TotpService],
})
export class DeactivateModule { }
