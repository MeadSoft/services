import { IFilter, IQueryService } from '@meadsoft/common';
import { ICrudRepository } from '@meadsoft/common-infrastructure';

export class QueryService<TModel> implements IQueryService<TModel> {
    constructor(public readonly repository: ICrudRepository<TModel>) {}

    async countRows(filters: IFilter[] | null): Promise<number> {
        return await this.repository.countRows(filters);
    }
    async findFirst(filters: IFilter[] | null): Promise<TModel | null> {
        return await this.repository.findFirst(filters);
    }
    async findMany(filters: IFilter[] | null): Promise<TModel[]> {
        return await this.repository.findMany(filters);
    }
}
