import { BaseServiceInterface } from 'src/interfaces/base/base.service.interface';
import { BaseEntity } from 'src/modules/shared/base.entity';
import { BaseRepositoryInterface } from 'src/repositories/base/base.interface.repository';
import {
    PaginateParams,
    SortParams,
    SearchParams,
    FindAllResponse,
} from 'src/types/common.type';

export abstract class BaseServiceAbstract<T extends BaseEntity>
    implements BaseServiceInterface<T>
{
    constructor(private readonly repository: BaseRepositoryInterface<T>) {}
    
    async create(create_dto: T | any): Promise<T> {
        return await this.repository.create(create_dto);
    }

    async findAll(
        filter?: object,
        options?: object,
        limit?: number,
        page?: number,
        sort?: SortParams,
    ): Promise<FindAllResponse<T>> {
        return await this.repository.findAll(filter, options, limit, page, sort);
    }
    async findOne(id: string) {
        return await this.repository.findOneById(id);
    }

    async update(id: string, update_dto: Partial<T>) {
        return await this.repository.update(id, update_dto);
    }

    async remove(id: string) {
        return await this.repository.softDelete(id);
    }
}
