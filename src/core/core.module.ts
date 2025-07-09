import { configModule } from './modules/env-config/env-config.module';
import { GraphqlConfiguredModule } from './modules/graphql/grapgql.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { CoreEnvConfig } from './core-env.config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StorageModule } from './modules/storage/storage.module';
import { LivekitModule } from './modules/livekit/livekit.module';
import { LivekitConfig } from './modules/livekit/livekit.config';
import { StripeModule } from './modules/stripe/stripe.module';
import { StripeConfig } from './modules/stripe/stripe.config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    configModule,
    GraphqlConfiguredModule,
    PrismaModule,
    RedisModule,
    NotificationsModule,
    StorageModule,
    LivekitModule.forRootAsync({
      useFactory: (livekitConfig: LivekitConfig) => ({
        apiUrl: livekitConfig.livekitUrl,
        apiKey: livekitConfig.livekitApiKey,
        apiSecret: livekitConfig.livekitApiSecret,
      }),
      inject: [LivekitConfig],
    }),
    StripeModule.forRootAsync({
      useFactory: (stripeConfig: StripeConfig) => ({
        apiKey: stripeConfig.stripeApiKey,
        config: {
          apiVersion: '2025-06-30.basil',
        },
      }),
      inject: [StripeConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
  ],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig, NotificationsModule],
})
export class CoreModule { }
