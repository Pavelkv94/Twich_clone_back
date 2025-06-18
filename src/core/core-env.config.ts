import { configValidationUtility } from '@/src/shared/utils/env-validation.utility';
import { ms, StringValue } from '@/src/shared/utils/ms.util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

// each module has it's own *.config.ts

@Injectable()
export class CoreEnvConfig {

    @IsNotEmpty({
        message: 'Set Env variable COOKIE_SECRET, example: secret',
    })
    cookieSecret: string;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_SECRET, example: secret',
    })
    sessionSecret: string;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_NAME, example: session',
    })
    sessionName: string;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_DOMAIN, example: localhost',
    })
    sessionDomain: string;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_MAX_AGE, example: 1h',
    })
    sessionMaxAge: number;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_HTTP_ONLY, example: true',
    })
    sessionHttpOnly: boolean;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_SECURE, example: true',
    })
    sessionSecure: boolean;

    @IsNotEmpty({
        message: 'Set Env variable SESSION_PREFIX, example: session',
    })
    sessionPrefix: string;

    @IsNotEmpty({
        message: 'Set Env variable ALLOWED_ORIGIN, example: http://localhost:3000',
    })
    allowedOrigin: string;

    @IsNotEmpty({
        message: 'Set Env variable APPLICATION_PORT, example: 3000',
    })
    applicationPort: number;

    constructor(private configService: ConfigService<any, true>) {
        this.cookieSecret = this.configService.get<string>('COOKIE_SECRET') as string;
        this.sessionSecret = this.configService.get<string>('SESSION_SECRET') as string;
        this.sessionName = this.configService.get<string>('SESSION_NAME') as string;
        this.sessionDomain = this.configService.get<string>('SESSION_DOMAIN') as string;
        this.sessionMaxAge = ms(this.configService.get<StringValue>('SESSION_MAX_AGE') as StringValue);
        this.sessionHttpOnly = configValidationUtility.convertToBoolean(this.configService.get<string>('SESSION_HTTP_ONLY')) as boolean;
        this.sessionSecure = configValidationUtility.convertToBoolean(this.configService.get<string>('SESSION_SECURE')) as boolean;
        this.sessionPrefix = this.configService.get<string>('SESSION_PREFIX');
        this.allowedOrigin = this.configService.get<string>('ALLOWED_ORIGIN');
        this.applicationPort = this.configService.get<number>('APPLICATION_PORT');

        configValidationUtility.validateConfig(this);
    }


}
