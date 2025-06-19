import { configValidationUtility } from "@/src/shared/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class StripeConfig {


    @IsNotEmpty({
        message: 'Set Env variable STRIPE_API_KEY',
    })
    stripeApiKey: string;

    @IsNotEmpty({
        message: 'Set Env variable STRIPE_WEBHOOK_SECRET',
    })
    stripeWebhookSecret: string;


    constructor(private configService: ConfigService) {
        this.stripeApiKey = this.configService.get<string>('STRIPE_SECRET_KEY') as string;
        this.stripeWebhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') as string;
        configValidationUtility.validateConfig(this);
    }
}
