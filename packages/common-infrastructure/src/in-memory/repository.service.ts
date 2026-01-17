import {
    EMPTY_LENGTH,
    FIRST_INDEX,
    IEntity,
    IFilter,
    ISchema,
} from '@meadsoft/common';
import {
    IQueryRepository,
    ICrudRepository,
} from '../contracts/repository.schema';
import { InMemoryUnitOfWork } from './unit-of-work.service';

export abstract class InMemoryQueryRepository<
    TModel extends IEntity,
    TId = string,
> implements IQueryRepository<TModel, TId> {
    constructor(
        public readonly table: string,
        protected schema: ISchema<TModel>,
        protected unitOfWork: InMemoryUnitOfWork,
    ) {}

    async countRows(...filters: IFilter[]): Promise<number> {
        return await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(and(...filters))
            .then((items) => items.length);
    }

    equals(item: TModel, id: TId): boolean {
        return item.id === id;
    }

    protected parseResult(item: unknown): TModel {
        const result = this.schema.parse(item);
        if (result.err) {
            throw result.val;
        }
        return result.val;
    }

    protected parseResults(...items: unknown[]): TModel[] {
        return items.map((item) => this.parseResult(item));
    }

    async findOne(id: TId): Promise<TModel | null> {
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(this.equals(id));
        if (items.length === EMPTY_LENGTH) {
            return null;
        }
        return this.parseResult(items[FIRST_INDEX]);
    }

    async findMany(...filters: IFilter[]): Promise<TModel[]> {
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(and(...filters));
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

    async exists(id: TId): Promise<boolean> {
        const items = await this.unitOfWork
            .getDatabase()
            .select()
            .from(this.table)
            .where(this.equals(id));
        return items.length > EMPTY_LENGTH;
    }
}

export abstract class InMemoryCommandRepository<
    TModel extends IEntity,
    TId = string,
>
    extends InMemoryQueryRepository<TModel, TId>
    implements ICrudRepository<TModel, TId>
{
    async createOne(item: TModel): Promise<TModel> {
        const created = await this.unitOfWork
            .getDatabase()
            .insert(this.table)
            .values(item)
            .returning();
        return this.parseResult(created[FIRST_INDEX]);
    }

    async createMany(...items: TModel[]): Promise<TModel[]> {
        const created = await this.unitOfWork
            .getDatabase()
            .insert(this.table)
            .values(items)
            .returning();
        return this.parseResults(...created);
    }

    async updateOne(id: TId, updates: Partial<TModel>): Promise<TModel> {
        const updated = await this.unitOfWork
            .getDatabase()
            .update(this.table)
            .set(updates)
            .where(this.equals(id))
            .returning();
        return this.parseResult(updated[FIRST_INDEX]);
    }

    async updateMany(
        updates: Partial<TModel>,
        ...filters: IFilter[]
    ): Promise<number> {
        // TODO: figure out how to type PgTransaction properly in UnitOfWorkService so this statements type is known
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const updated = (await this.unitOfWork
            .getDatabase()
            .update(this.table)
            .set(updates)
            .where(and(...filters))) as QueryResultBase;
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

    async deleteMany(...filters: IFilter[]): Promise<number> {
        // TODO: figure out how to type PgTransaction properly in UnitOfWorkService so this statements type is known
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const result = (await this.unitOfWork
            .getDatabase()
            .delete(this.table)
            .where(and(...filters))) as QueryResultBase;
        return result.rowCount ?? EMPTY_LENGTH;
    }
}
