import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { CoreEnvConfig } from '@/src/core/config/core-env.config';
import { BcryptService } from '@/src/shared/bcrypt.service';

@Module({
  providers: [SessionResolver, SessionService, CoreEnvConfig, BcryptService],
})
export class SessionModule { }
