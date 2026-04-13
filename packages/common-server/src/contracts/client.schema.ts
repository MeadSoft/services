import { IFilter } from './filters.schema';

export interface IQueryClient<TModel = unknown, TId = string> {
    countRows(...filters: IFilter[]): Promise<number>;
    findOne(id: TId): Promise<TModel | null>;
    findMany(...filters: IFilter[]): Promise<TModel[]>;
}

/**
 * It is assumed that authentication and authorization are handled at a higher level
 * (such as middleware or a transport layer), so userId is not included in the command
 * service methods.
 */
export interface ICommandClient<
    TNewModel = unknown,
    TModel = unknown,
    TId = string,
> {
    createOne(item: TNewModel): Promise<TModel>;
    createMany(...items: TNewModel[]): Promise<TModel[]>;
    updateOne(id: TId, updates: Partial<TModel>): Promise<TModel>;
    updateMany(
        updates: Partial<TModel>,
        ...filters: IFilter[]
    ): Promise<number>;
    deleteOne(id: TId): Promise<boolean>;
    deleteMany(...filters: IFilter[]): Promise<number>;
}

export interface ICrudClient<TNewModel, TModel, TId = string>
    extends IQueryClient<TModel, TId>, ICommandClient<TNewModel, TModel, TId> {}
