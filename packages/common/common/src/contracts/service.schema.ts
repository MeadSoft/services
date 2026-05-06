import { IFilter } from './filters.schema';
import { Result } from 'ts-results';

export interface IQueryService<TModel = unknown> {
    countRows(filters: IFilter[] | null): Promise<number>;
    findFirst(filters: IFilter[] | null): Promise<TModel | null>;
    findMany(filters: IFilter[] | null): Promise<TModel[]>;
}

export interface ICommandService<
    TNewModel = unknown,
    TModel = unknown,
    TId = string,
> {
    createOne(userId: string, item: TNewModel): Promise<Result<TModel, Error>>;
    createMany(
        userId: string,
        ...items: TNewModel[]
    ): Promise<Result<TModel[], Error>>;
    seedOne(item: TNewModel): Promise<Result<TModel, Error>>;
    seedMany(...items: TNewModel[]): Promise<Result<TModel[], Error>>;
    updateOne(
        userId: string,
        id: TId,
        updates: Partial<TModel>,
    ): Promise<Result<TModel, Error>>;
    updateMany(
        userId: string,
        updates: Partial<TModel>,
        filters: IFilter[] | null,
    ): Promise<Result<number, Error>>;
    deleteOne(userId: string, id: TId): Promise<Result<boolean, Error>>;
    deleteMany(
        userId: string,
        filters: IFilter[] | null,
    ): Promise<Result<number, Error>>;
}

export interface ICrudService<TNewModel, TModel, TId = string>
    extends IQueryService<TModel>, ICommandService<TNewModel, TModel, TId> {}
