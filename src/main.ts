import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { RedisService } from './core/redis/redis.service';
import { RedisStore } from 'connect-redis';
import { CoreEnvConfig } from './core/config/core-env.config';
import { initAppModule } from './init-app';

async function bootstrap() {

  const dynamicAppModule = await initAppModule();
  const app = await NestFactory.create(dynamicAppModule);

  const config = app.get<CoreEnvConfig>(CoreEnvConfig);
  const redis = app.get(RedisService);

  app.use(cookieParser(config.cookieSecret));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  app.use(session({
    secret: config.sessionSecret,
    name: config.sessionName,
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: config.sessionDomain,
      maxAge: config.sessionMaxAge,
      httpOnly: config.sessionHttpOnly,
      secure: config.sessionSecure,
      sameSite: "lax"
    },
    store: new RedisStore({
      client: redis,
      prefix: config.sessionPrefix,
    })
  }))

  app.enableCors({
    origin: config.allowedOrigin,
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  });

  await app.listen(config.applicationPort);
}
bootstrap();


