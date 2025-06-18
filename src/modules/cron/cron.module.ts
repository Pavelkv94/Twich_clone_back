import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from '@/src/core/modules/notifications/email.service';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, EmailService, TelegramService],
})
export class CronModule { }
