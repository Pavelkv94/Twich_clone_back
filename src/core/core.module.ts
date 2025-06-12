import { configModule } from './modules/config/config.module';
import { GraphqlConfiguredModule } from './modules/graphql/grapgql.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { CoreEnvConfig } from './config/core-env.config';

@Module({
  imports: [
    configModule,
    GraphqlConfiguredModule,
    PrismaModule,
    RedisModule
  ],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig],
})
export class CoreModule { }
