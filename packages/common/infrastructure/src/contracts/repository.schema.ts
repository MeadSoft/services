import { IFilter, NotImplementedException } from '@meadsoft/common';

export interface IQueryRepository<TModel = unknown, TId = string> {
    countRows(...filters: IFilter[]): Promise<number>;
    findOne(id: TId): Promise<TModel | null>;
    findMany(...filters: IFilter[]): Promise<TModel[]>;
}

export interface ICommandRepository<TModel = unknown, TId = string> {
    createOne(item: TModel): Promise<TModel>;
    createMany(...items: TModel[]): Promise<TModel[]>;
    updateOne(id: TId, updates: Partial<TModel>): Promise<TModel>;
    updateMany(
        updates: Partial<TModel>,
        ...filters: IFilter[]
    ): Promise<number>;
    deleteOne(id: TId): Promise<boolean>;
    deleteMany(...filters: IFilter[]): Promise<number>;
}

export interface ICrudRepository<TModel = unknown, TId = string>
    extends IQueryRepository<TModel, TId>, ICommandRepository<TModel, TId> {}

/**
 * A class to quickly create dummy classes by extending this class, with the
 * intention of overriding the child class with a valid implementation during
 * dependency injection setup
 */
export class DummyQueryRepository implements IQueryRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async countRows(..._filters: IFilter[]): Promise<number> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findOne(_id: string): Promise<unknown> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findMany(..._filters: IFilter[]): Promise<unknown[]> {
        return Promise.reject(new NotImplementedException());
    }
}

/**
 * A class to quickly create dummy classes by extending this class, with the
 * intention of overriding the child class with a valid implementation during
 * dependency injection setup
 */
export class DummyCrudRepository
    extends DummyQueryRepository
    implements ICrudRepository
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createOne(_item: unknown): Promise<unknown> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createMany(..._items: unknown[]): Promise<unknown[]> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateOne(_id: string, _updates: Partial<unknown>): Promise<unknown> {
        return Promise.reject(new NotImplementedException());
    }
    async updateMany(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _updates: Partial<unknown>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ..._filters: IFilter[]
    ): Promise<number> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteOne(_id: string): Promise<boolean> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteMany(..._filters: IFilter[]): Promise<number> {
        return Promise.reject(new NotImplementedException());
    }
}
