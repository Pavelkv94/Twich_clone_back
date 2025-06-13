import { configModule } from './modules/config/config.module';
import { GraphqlConfiguredModule } from './modules/graphql/grapgql.module';
import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { CoreEnvConfig } from './core-env.config';
import { NotificationsModule } from './modules/notifications/notifications.module';


@Module({
  imports: [
    configModule,
    GraphqlConfiguredModule,
    PrismaModule,
    RedisModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig, NotificationsModule],
})
export class CoreModule { }
