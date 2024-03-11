import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './entities/inventory.entity';
import { InventoriesRepository } from './repositories/inventory.repository';

@Module({
  controllers: [InventoriesController],
  providers: [
    InventoriesService,
    { provide: 'InventoriesRepositoryInterface', useClass: InventoriesRepository }
  ],
  imports: [MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }])],
  exports: [InventoriesService]
})
export class InventoriesModule {}
