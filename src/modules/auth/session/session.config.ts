import { configValidationUtility } from '@/src/shared/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';


@Injectable()
export class SessionConfig {

    @IsNotEmpty({
        message: 'Set Env variable SESSION_NAME, example: session',
    })
    sessionName: string;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_PREFIX, example: session',
    })
    sessionPrefix: string;

    constructor(private configService: ConfigService<any, true>) {
        this.sessionPrefix = this.configService.get<string>('SESSION_PREFIX');
        this.sessionName = this.configService.get<string>('SESSION_NAME');

        configValidationUtility.validateConfig(this);
    }


}
