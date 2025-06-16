import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from '@/src/core/modules/notifications/email.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, EmailService],
})
export class CronModule { }
