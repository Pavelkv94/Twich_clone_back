import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConfig {
    redisUri: string;
    redisUser: string;
    redisPassword: string;
    redisHost: string;
    redisPort: number;

    constructor(private configService: ConfigService) {
        this.redisUri = this.configService.getOrThrow<string>('REDIS_URI');
        this.redisUser = this.configService.getOrThrow<string>('REDIS_USER');
        this.redisPassword = this.configService.getOrThrow<string>('REDIS_PASSWORD');
        this.redisHost = this.configService.getOrThrow<string>('REDIS_HOST');
        this.redisPort = this.configService.getOrThrow<number>('REDIS_PORT');
    }
}
