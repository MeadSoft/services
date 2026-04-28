import { NotImplementedException } from '@nestjs/common';

export interface IUnitOfWorkService<TDb = unknown, TTransaction = unknown> {
    /**
     * Get the current database connection or transaction
     */
    getDatabase(): TDb | TTransaction;
    /**
     * Execute work within a transaction
     */
    startTransaction<T>(work: () => Promise<T>): Promise<T>;
    /**
     * Check if currently in a transaction
     */
    isInTransaction(): boolean;
}

/**
 * An unimplemented base class intended to be overridden during dependency injection setup
 */
export class UnitOfWorkService<
    TDb = unknown,
    TTransaction = unknown,
> implements IUnitOfWorkService<TDb, TTransaction> {
    protected getActualDatabase: () => TDb;
    protected currentTransaction?: TTransaction;

    constructor(getDatabase: () => TDb) {
        this.getActualDatabase = getDatabase;
    }

    /**
     * Get the current database connection or transaction
     */
    getDatabase(): TDb | TTransaction {
        throw new NotImplementedException();
    }

    /**
     * Execute work within a transaction
     */
    async startTransaction<T>(work: () => Promise<T>): Promise<T> {
        return await work();
    }

    /**
     * Check if currently in a transaction
     */
    isInTransaction(): boolean {
        return this.currentTransaction !== undefined;
    }
}
