import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService extends Redis {
    constructor(redisConfig: RedisConfig) {
        super(redisConfig.redisUri);
    }
}
