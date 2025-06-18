import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { TokenService } from '@/src/shared/token.service';

@Module({
  providers: [NotificationResolver, NotificationService, TokenService],
})
export class NotificationModule { }
