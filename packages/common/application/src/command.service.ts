import {
    ICommandService,
    IEntity,
    IFilter,
    IUpdateHistory,
    NotImplementedException,
} from '@meadsoft/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import {
    ICrudRepository,
    IUnitOfWorkService,
} from '@meadsoft/common-infrastructure';
import { Err, Ok, Result } from 'ts-results';
import { QueryService } from './query.service';

/**
 * Base command service providing common create, update, and delete operations for entities.
 * Services for specific entities can extend this base class and provide entity-specific logic as needed.
 */
export class CommandService<
    TNewModel extends object,
    TModel extends IEntity & TNewModel,
>
    extends QueryService<TModel>
    implements ICommandService<TNewModel, TModel>
{
    constructor(
        repository: ICrudRepository<TModel>,
        public readonly unitOfWork: IUnitOfWorkService,
        public readonly entityService: EntityService,
        public readonly changeHistoryService: ChangeHistoryService,
        private readonly createFromNew: (
            userId: string,
            newModel: TNewModel,
        ) => Result<TModel, Error>,
    ) {
        super(repository);
    }

    async createOne(
        userId: string,
        newItem: TNewModel,
    ): Promise<Result<TModel, Error>> {
        const item = this.createFromNew(userId, newItem);
        if (item.err) {
            return Err(item.val);
        }
        return this.unitOfWork.startTransaction(async () => {
            return Ok(await this.repository.createOne(item.val));
        });
    }

    async createMany(
        userId: string,
        ...newItems: TNewModel[]
    ): Promise<Result<TModel[], Error>> {
        const items = newItems.map((item) => this.createFromNew(userId, item));
        const firstFoundError = Result.all(...items);
        if (firstFoundError.err) {
            return firstFoundError;
        }
        const okItems = items.map((res) => res.unwrap());
        return this.unitOfWork.startTransaction(async () => {
            return Ok(
                await this.repository.createMany.bind(this.repository)(
                    ...okItems,
                ),
            );
        });
    }

    /**
     * Create many items from existing data. This bypasses entity initialization and validation
     */
    async seedOne(item: TModel): Promise<Result<TModel, Error>> {
        return this.unitOfWork.startTransaction(async () => {
            return Ok(
                await this.repository.createOne.bind(this.repository)(item),
            );
        });
    }

    /**
     * Create many items from existing data. This bypasses entity initialization and validation
     */
    async seedMany(...items: TModel[]): Promise<Result<TModel[], Error>> {
        return this.unitOfWork.startTransaction(async () => {
            return Ok(
                await this.repository.createMany.bind(this.repository)(
                    ...items,
                ),
            );
        });
    }

    async updateOne(
        userId: string,
        id: string,
        updates: IUpdateHistory & Partial<TModel>,
    ): Promise<Result<TModel, Error>> {
        const updatedItem = this.changeHistoryService.update(userId, updates);
        return this.unitOfWork.startTransaction(async () => {
            return Ok(await this.repository.updateOne(id, updatedItem));
        });
    }

    // TODO: implement IFilter to SQL mapping
    async updateMany(
        userId: string,
        updates: Partial<TModel>,
        ...filters: IFilter[]
    ): Promise<Result<number, Error>> {
        console.log(userId, updates, filters);
        return Ok(await Promise.reject(new NotImplementedException()));
    }

    async deleteOne(
        userId: string,
        id: string,
    ): Promise<Result<boolean, Error>> {
        const existingItem = await this.repository.findOne(id);
        if (!existingItem) {
            return Ok(false);
        }
        // TODO: improve typing here so unsafe assertions are not needed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const updates = {
            updatedById: null,
            updatedDate: null,
        } as IUpdateHistory & Partial<TModel>;
        // Update the items change history before deletion for proper auditing
        const updatedChangeHistory = this.changeHistoryService.update(
            userId,
            updates,
        );
        return await this.unitOfWork.startTransaction(async () => {
            await this.updateOne(userId, id, updatedChangeHistory);
            return Ok(await this.repository.deleteOne(id));
        });
    }

    async deleteMany(userId: string): Promise<Result<number, Error>> {
        return Ok(await Promise.reject(new NotImplementedException()));
        // TODO: improve typing here so unsafe assertions are not needed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const updates = {
            updatedById: null,
            updatedDate: null,
        } as IUpdateHistory & Partial<TModel>;
        // Update the items change history before deletion for proper auditing
        const updatedChangeHistory = this.changeHistoryService.update(
            userId,
            updates,
        );
        return await this.unitOfWork.startTransaction(async () => {
            await this.updateMany(userId, updatedChangeHistory);
            return Ok(await Promise.reject(new NotImplementedException()));
        });
    }
}

/**
 * An alias for {@link CommandService}
 */
export class CrudService<
    TNewModel extends object,
    TModel extends IEntity & TNewModel,
> extends CommandService<TNewModel, TModel> {
    constructor(
        repository: ICrudRepository<TModel>,
        unitOfWork: IUnitOfWorkService,
        entityService: EntityService,
        changeHistoryService: ChangeHistoryService,
        createFromNew: (
            userId: string,
            newModel: TNewModel,
        ) => Result<TModel, Error>,
    ) {
        super(
            repository,
            unitOfWork,
            entityService,
            changeHistoryService,
            createFromNew,
        );
    }
}
