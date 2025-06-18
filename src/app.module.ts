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
import { StreamModule } from './modules/stream/stream.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { CategoryModule } from './modules/category/category.module';
import { ChatModule } from './modules/chat/chat.module';
import { FollowModule } from './modules/follow/follow.module';
import { ChannelModule } from './modules/channel/channel.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    CoreModule,
    AccountModule,
    SessionModule,
    VerificationModule,
    PassRecoveryModule,
    TotpModule,
    DeactivateModule,
    CronModule,
    ProfileModule,
    StreamModule,
    WebhookModule,
    CategoryModule,
    ChatModule,
    FollowModule,
    ChannelModule,
    NotificationModule,
    TelegramModule,



  ],
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
      imports: [
        CoreModule,
        AccountModule,
        SessionModule,
        VerificationModule,
        PassRecoveryModule,
        TotpModule,
        DeactivateModule,
        CronModule,
        ProfileModule,
        StreamModule,
        WebhookModule,
        CategoryModule,
        ChatModule,
        FollowModule,
        ChannelModule,
        NotificationModule,
        TelegramModule,
      ],
    };
  }
}
