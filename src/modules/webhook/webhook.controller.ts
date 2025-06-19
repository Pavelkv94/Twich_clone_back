import { Body, Controller, Headers, HttpCode, HttpStatus, Post, RawBody, UnauthorizedException } from '@nestjs/common';
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

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async receiveWebhookStripe(@RawBody() rawBody: any, @Headers('stripe-signature') stripeSignature: string) {
    if (!stripeSignature) {
      throw new UnauthorizedException('Stripe signature is required in headers');
    }
    const event = await this.webhookService.constructStripeEvent(rawBody, stripeSignature);
    await this.webhookService.receiveWebhookStripe(event);
    return {
      message: 'Webhook received'
    }
  }
}
