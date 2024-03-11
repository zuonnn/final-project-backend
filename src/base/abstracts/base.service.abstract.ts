import { BaseServiceInterface } from 'src/base/interfaces/base.service.interface';
import { BaseEntity } from 'src/base/entities/base.entity';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from '../repositories/base.interface.repository';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseServiceAbstract<T extends BaseEntity>
    implements BaseServiceInterface<T>
{
    constructor(private readonly repository: BaseRepositoryInterface<T>) { }

    async create(create_dto: T | any): Promise<T> {
        return await this.repository.create(create_dto);
    }

    async findAll(
        filter?: object,
        options?: object
    ): Promise<FindAllResponse<T>> {
        return await this.repository.findAll(filter, options);
    }
    async findOne(id: string) {
        return await this.repository.findOneById(id);
    }

    async update(id: string, update_dto: Partial<T>){
        const existing = await this.repository.findOneById( id );
        if (!existing) {
            throw new NotFoundException(`Entity with ID ${id} not found`);
        }
        return await this.repository.update(id, update_dto);
    }

    async remove(id: string) {
        const existing = await this.repository.findOneById( id );
        if (!existing) {
            throw new NotFoundException(`Entity with ID ${id} not found`);
        }
        return await this.repository.softDelete(id);
    }
}
