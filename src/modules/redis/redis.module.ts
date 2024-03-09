import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis'
import { ProductsModule } from '../products/products.module';


@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
        }
      }
    }),
    ProductsModule
  ],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule { }
