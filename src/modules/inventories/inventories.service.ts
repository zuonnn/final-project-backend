import { Inject, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoryRepositoryInterface } from './interfaces/inventory.interface';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoriesService extends BaseServiceAbstract<Inventory>{
  constructor(
    @Inject('InventoriesRepositoryInterface') private readonly inventoriesRepository: InventoryRepositoryInterface,
  ) {
    super(inventoriesRepository);
  }
  async addProductToInventory(createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoriesRepository.create(createInventoryDto);
    return inventory;
  }

  async findByProductId(product_id: string) {
    return this.inventoriesRepository.findOneByCondition({ product_id });
  }

  async addStockToProduct(product_id: string, quantity: number) {
    const inventory = await this.findByProductId(product_id);
    if (!inventory) return;
    inventory.stock += quantity;
    await this.inventoriesRepository.update(inventory._id, inventory);
  }
}
