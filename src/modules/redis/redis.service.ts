import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProductsService } from '../products/products.service';

@Injectable()
export class RedisService {
    constructor (
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private productService: ProductsService
    ) {}

    async aquireLock({productId, quantity, cartId}) {
        const key = `lock_v2024_${productId}`;
        const retryTimes = 10;
        const expireTime = 3000; //3 seconds
    }

}
