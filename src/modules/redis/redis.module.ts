import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { InventoriesModule } from '../inventories/inventories.module';
import { RedisConnectionService } from './redis-connection.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    InventoriesModule,
    ConfigModule
  ],
  controllers: [RedisController],
  providers: [RedisService, RedisConnectionService],
  exports: [RedisService, RedisConnectionService]
})
export class RedisModule { }

