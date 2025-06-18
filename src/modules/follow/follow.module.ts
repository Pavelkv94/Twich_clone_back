import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { NotificationService } from '../notification/notification.service';
import { TokenService } from '@/src/shared/token.service';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  providers: [FollowResolver, FollowService, NotificationService, TokenService, TelegramService],
})
export class FollowModule {}
