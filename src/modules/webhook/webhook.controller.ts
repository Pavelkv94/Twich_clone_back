import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }


  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  async receiveWebhookLivekit(@Body() body: any, @Headers('Authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.webhookService.receiveWebhookLivekit(body, authHeader);
  }
}
