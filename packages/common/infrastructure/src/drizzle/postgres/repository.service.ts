import { SQL } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import {
    EMPTY_LENGTH,
    FIRST_INDEX,
    IFilter,
    ISchema,
    parseResult,
    parseResults,
} from '@meadsoft/common';
import {
    IQueryRepository,
    ICrudRepository,
} from '../../contracts/repository.schema';
import { PostgresUnitOfWork } from './unit-of-work.service';
import { QueryResultBase } from 'pg';
import { IFilterTranslationService } from '../../contracts/filter-translation.schema';

export abstract class DrizzlePgQueryRepository<
    TModel extends object,
    TId = string,
    TSchema extends Record<string, unknown> = Record<string, never>,
> implements IQueryRepository<TModel, TId> {
    constructor(
        public readonly table: PgTable,
        protected schema: ISchema<TModel>,
        protected unitOfWork: PostgresUnitOfWork<TSchema>,
        protected filterTranslationService: IFilterTranslationService<SQL>,
    ) {}

    async countRows(filters: IFilter[] | null): Promise<number> {
        const sqlFiltersResult =
            this.filterTranslationService.translate(filters);
        const sqlFilters = sqlFiltersResult.unwrap();
        return await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(sqlFilters)
            .then((items) => items.length);
    }

    abstract equals(id: TId): SQL | undefined;

    async findById(id: TId): Promise<TModel | null> {
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(this.equals(id));
        if (items.length === EMPTY_LENGTH) {
            return null;
        }
        return parseResult(items[FIRST_INDEX], this.schema);
    }

    async findFirst(filters: IFilter[] | null): Promise<TModel | null> {
        const sqlFiltersResult =
            this.filterTranslationService.translate(filters);
        const sqlFilters = sqlFiltersResult.unwrap();
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(sqlFilters);
        if (items.length === EMPTY_LENGTH) {
            return null;
        }
        return parseResult(items[FIRST_INDEX], this.schema);
    }

    async findMany(filters: IFilter[] | null): Promise<TModel[]> {
        const sqlFiltersResult =
            this.filterTranslationService.translate(filters);
        const sqlFilters = sqlFiltersResult.unwrap();
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(sqlFilters);
        const results: TModel[] = [];
        for (const item of items) {
            const result = this.schema.parse(item);
            if (result.err) {
                throw result.val;
            }
            results.push(result.val);
        }
        return results;
    }

    async exists(filters: IFilter[] | null): Promise<boolean> {
        const sqlFiltersResult =
            this.filterTranslationService.translate(filters);
        const sqlFilters = sqlFiltersResult.unwrap();
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(sqlFilters);
        return items.length > EMPTY_LENGTH;
    }
}

export abstract class DrizzlePgCommandRepository<
    TModel extends object,
    TId extends string = string,
    TSchema extends Record<string, unknown> = Record<string, never>,
>
    extends DrizzlePgQueryRepository<TModel, TId, TSchema>
    implements ICrudRepository<TModel, TId>
{
    async createOne(item: TModel): Promise<TModel> {
        const created = await this.unitOfWork
            .getDatabase()
            .insert(this.table)
            .values(item)
            .returning();
        return parseResult(created[FIRST_INDEX], this.schema);
    }

    async createMany(items: TModel[]): Promise<TModel[]> {
        const created = await this.unitOfWork
            .getDatabase()
            .insert(this.table)
            .values(items)
            .returning();
        return parseResults(created, this.schema);
    }

    async updateOne(id: TId, updates: Partial<TModel>): Promise<TModel> {
        const updated = await this.unitOfWork
            .getDatabase()
            .update(this.table)
            .set(updates)
            .where(this.equals(id))
            .returning();
        return parseResult(updated[FIRST_INDEX], this.schema);
    }

    async updateMany(
        updates: Partial<TModel>,
        filters: IFilter[] | null,
    ): Promise<number> {
        const sqlFiltersResult =
            this.filterTranslationService.translate(filters);
        const sqlFilters = sqlFiltersResult.unwrap();
        // TODO: figure out how to type PgTransaction properly in UnitOfWorkService so this statements type is known
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const updated = (await this.unitOfWork
            .getDatabase()
            .update(this.table)
            .set(updates)
            .where(sqlFilters)) as QueryResultBase;
        return updated.rowCount ?? EMPTY_LENGTH;
    }

    async deleteOne(id: TId): Promise<boolean> {
        // TODO: figure out how to type PgTransaction properly in UnitOfWorkService so this statements type is known
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const result = (await this.unitOfWork
            .getDatabase()
            .delete(this.table)
            .where(this.equals(id))) as QueryResultBase;
        return result.rowCount === null
            ? false
            : result.rowCount > EMPTY_LENGTH;
    }

    async deleteMany(filters: IFilter[] | null): Promise<number> {
        const sqlFiltersResult =
            this.filterTranslationService.translate(filters);
        const sqlFilters = sqlFiltersResult.unwrap();
        // TODO: figure out how to type PgTransaction properly in UnitOfWorkService so this statements type is known
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const result = (await this.unitOfWork
            .getDatabase()
            .delete(this.table)
            .where(sqlFilters)) as QueryResultBase;
        return result.rowCount ?? EMPTY_LENGTH;
    }
}
