import { Inject, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoryRepositoryInterface } from './interfaces/inventory.interface';

@Injectable()
export class InventoriesService {
  constructor(
    @Inject('InventoriesRepositoryInterface') private readonly inventoriesRepository: InventoryRepositoryInterface,
  ) {}
  async insertProductToInventory(createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoriesRepository.create(createInventoryDto);
    return inventory;
  }

  async findByProductId(product_id: string) {
    return this.inventoriesRepository.findOneByCondition({ product_id });
  }
}
