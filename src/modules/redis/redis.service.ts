import { Inject, Injectable } from '@nestjs/common';
import { InventoryRepositoryInterface } from '../inventories/interfaces/inventory.interface';
import { RedisConnectionService } from './redis-connection.service';
@Injectable()
export class RedisService {
    constructor(
        private readonly redisConnectionService: RedisConnectionService,
        @Inject('InventoriesRepositoryInterface') private readonly inventoriesRepository: InventoryRepositoryInterface,
    ) { }
    redisClient = this.redisConnectionService.getClient(); 

    async aquireLock({ product_id, quantity, cart_id }) {

        const key = `lock_v2024_${product_id}`;
        const retryTimes = 10;
        const expireTime = 3000; // 3 seconds
    
        for (let i = 0; i < retryTimes; i++) {
            // const result = await setnx(key, expireTime);
            const result = await this.redisClient.setnx(key, expireTime);
            if (result === 1) {
                const isReservation = await this.inventoriesRepository.reservationInventory({ product_id, quantity, cart_id });
                if (isReservation.modifiedCount) {
                    await this.redisClient.pexpire(key, expireTime);
                    return key;
                }
                return null;
            } else {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }    

    async releaseLock(key: any) {
        await this.redisClient.del(key);
    }

    async setKeyValue() {
        const result = await this.redisClient.hset('hash_key1111', 'hashtest', 'some value');
        if (result === 1) {
            return 'Key set';
        }
        return 'Key already exists';
    }
}
