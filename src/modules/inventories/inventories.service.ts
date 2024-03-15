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
  async insertProductToInventory(createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoriesRepository.create(createInventoryDto);
    return inventory;
  }

  async findByProductId(product_id: string) {
    return this.inventoriesRepository.findOneByCondition({ product_id });
  }
}
