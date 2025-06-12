import { DynamicModule, Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AccountModule } from './modules/auth/account/account.module';
import { SessionModule } from './modules/auth/session/session.module';
import { CoreEnvConfig } from './core/config/core-env.config';

@Module({
  imports: [CoreModule, AccountModule, SessionModule],
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
      imports: [CoreModule, AccountModule, SessionModule],
    };
  }
}
