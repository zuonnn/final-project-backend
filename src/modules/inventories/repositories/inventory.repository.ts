import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Inventory } from '../entities/inventory.entity';
import { InventoryRepositoryInterface } from '../interfaces/inventory.interface';

@Injectable()
export class InventoriesRepository
    extends BaseRepositoryAbstract<Inventory>
    implements InventoryRepositoryInterface {
    constructor(
        @InjectModel(Inventory.name)
        private readonly inventoryModel: Model<Inventory>,
    ) {
        super(inventoryModel);
    }

}
