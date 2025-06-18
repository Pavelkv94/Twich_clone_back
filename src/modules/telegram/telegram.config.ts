import { configValidationUtility } from "@/src/shared/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class TelegramConfig {

  @IsNotEmpty({
    message: 'Set Env variable TELEGRAM_BOT_TOKEN, example: 1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
  })
  telegramBotToken: string;

  constructor(private configService: ConfigService) {
    this.telegramBotToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') as string;
    configValidationUtility.validateConfig(this);
  }
}
