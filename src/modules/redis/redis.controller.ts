import { Controller, Get, Post } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  setKeyValue() {
    return this.redisService.setKeyValue();
  }
}
