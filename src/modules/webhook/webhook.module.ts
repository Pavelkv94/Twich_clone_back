import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { RawBodyMiddleware } from '@/src/shared/middlewares/raw-body.middleware';
import { NotificationService } from '../notification/notification.service';
import { TokenService } from '@/src/shared/token.service';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificationService, TokenService, TelegramService],
})
export class WebhookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes({ path: 'webhook/livekit', method: RequestMethod.POST });
  }
}
