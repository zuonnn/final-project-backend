import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisConnectionService {
    private redisClient: Redis.Redis;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.redisClient = new Redis.Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
        });
    }

    getClient(): Redis.Redis {
        return this.redisClient;
    }
}