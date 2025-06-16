import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { BcryptService } from '@/src/shared/bcrypt.service';
import { SessionConfig } from './session.config';
import { TotpService } from '../totp/totp.service';

@Module({
  imports: [],
  providers: [SessionResolver, SessionService, SessionConfig, BcryptService, TotpService],
  exports: [SessionService, SessionConfig]
})
export class SessionModule { }
