import { configValidationUtility } from "@/src/shared/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class StreamConfig {

    @IsNotEmpty({
        message: 'Set Env variable LIVEKIT_API_KEY, example: APIneTXTzQFvMx2',
    })
    livekitApiKey: string;
    @IsNotEmpty({
        message: 'Set Env variable LIVEKIT_API_SECRET, example: RCkVXyq0wZ0IoKMf7PPfyCIo8etAROZkeZApMl2Hty6D',
    })
    livekitApiSecret: string;

    constructor(private configService: ConfigService) {
        this.livekitApiKey = this.configService.get<string>('LIVEKIT_API_KEY') as string;
        this.livekitApiSecret = this.configService.get<string>('LIVEKIT_API_SECRET') as string;
        configValidationUtility.validateConfig(this);
    }
}
