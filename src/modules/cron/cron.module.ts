import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from '@/src/core/modules/notifications/email.service';
import { TelegramService } from '../telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';
import { TokenService } from '@/src/shared/token.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, EmailService, TelegramService, NotificationService, TokenService],
})
export class CronModule { }
