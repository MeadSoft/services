import { IQueryService } from '@meadsoft/common';
import { ICrudRepository } from '@meadsoft/common-infrastructure';

export class QueryService<TModel> implements IQueryService<TModel> {
    constructor(public readonly repository: ICrudRepository<TModel>) {}

    // TODO: implement IFilter to SQL mapping
    // async count(...filters: IFilter[]): Promise<number> {
    async countRows(): Promise<number> {
        return await this.repository.countRows();
    }

    async findOne(id: string): Promise<TModel | null> {
        return await this.repository.findOne(id);
    }
    // TODO: implement IFilter to SQL mapping
    // async findMany(...filters: IFilter[]): Promise<TModel[]> {
    async findMany(): Promise<TModel[]> {
        // return await this.repository.findMany(...filters);
        return await this.repository.findMany();
    }
}
