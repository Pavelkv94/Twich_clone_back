import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramConfig } from './telegram.config';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), //! TelegramConfig working incorrectly
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') as string,
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [TelegramService],
})
export class TelegramModule { }
