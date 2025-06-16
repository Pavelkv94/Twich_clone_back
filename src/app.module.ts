import { DynamicModule, Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AccountModule } from './modules/auth/account/account.module';
import { SessionModule } from './modules/auth/session/session.module';
import { CoreEnvConfig } from './core/core-env.config';
import { VerificationModule } from './modules/auth/verification/verification.module';
import { PassRecoveryModule } from './modules/auth/pass-recovery/pass-recovery.module';
import { TotpModule } from './modules/auth/totp/totp.module';
import { DeactivateModule } from './modules/auth/deactivate/deactivate.module';
import { CronModule } from './modules/cron/cron.module';
import { ProfileModule } from './modules/auth/profile/profile.module';

@Module({
  imports: [CoreModule, AccountModule, SessionModule, VerificationModule, PassRecoveryModule, TotpModule, DeactivateModule, CronModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  //* такой мудрёный способ мы используем, чтобы добавить к основным модулям необязательный модуль.
  //* чтобы не обращаться в декораторе к переменной окружения через process.env в декораторе, потому что
  //* запуск декораторов происходит на этапе склейки всех модулей до старта жизненного цикла самого NestJS
  static forRoot(config: CoreEnvConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [CoreModule, AccountModule, SessionModule, VerificationModule, PassRecoveryModule, TotpModule, DeactivateModule, CronModule],
    };
  }
}
