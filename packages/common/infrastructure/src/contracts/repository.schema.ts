import { IFilter, NotImplementedException } from '@meadsoft/common';

export interface IQueryRepository<TModel = unknown, TId = string> {
    countRows(filters: IFilter[] | null): Promise<number>;
    findById(id: TId): Promise<TModel | null>;
    findFirst(filters: IFilter[] | null): Promise<TModel | null>;
    findMany(filters: IFilter[] | null): Promise<TModel[]>;
}

export interface ICommandRepository<TModel = unknown, TId = string> {
    createOne(item: TModel): Promise<TModel>;
    createMany(items: TModel[]): Promise<TModel[]>;
    updateOne(id: TId, updates: Partial<TModel>): Promise<TModel>;
    updateMany(
        updates: Partial<TModel>,
        filters: IFilter[] | null,
    ): Promise<number>;
    deleteOne(id: TId): Promise<boolean>;
    deleteMany(filters: IFilter[] | null): Promise<number>;
}

export interface ICrudRepository<TModel = unknown, TId = string>
    extends IQueryRepository<TModel>, ICommandRepository<TModel, TId> {}

/**
 * A class to quickly create dummy classes by extending this class, with the
 * intention of overriding the child class with a valid implementation during
 * dependency injection setup
 */
export class DummyQueryRepository implements IQueryRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async countRows(_filters: IFilter[] | null): Promise<number> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findById(_id: string): Promise<unknown> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findFirst(_filters: IFilter[] | null): Promise<unknown> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findMany(_filters: IFilter[] | null): Promise<unknown[]> {
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
    async createMany(_items: unknown[]): Promise<unknown[]> {
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
        _filters: IFilter[] | null,
    ): Promise<number> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteOne(_id: string): Promise<boolean> {
        return Promise.reject(new NotImplementedException());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteMany(_filters: IFilter[] | null): Promise<number> {
        return Promise.reject(new NotImplementedException());
    }
}
