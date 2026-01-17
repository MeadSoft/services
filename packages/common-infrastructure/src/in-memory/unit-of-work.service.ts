import { Injectable } from '@nestjs/common';
import { InMemoryDbService } from './in-memory-db.service';
import { UnitOfWorkService } from '../contracts/unit-of-work.schema';
import {
    InMemoryDatabase,
    InMemoryTransaction,
} from './in-memory-database.schema';

@Injectable()
export class InMemoryUnitOfWork extends UnitOfWorkService<
    InMemoryDatabase,
    InMemoryTransaction
> {
    constructor(databaseService: InMemoryDbService) {
        super(() => databaseService.getDatabase());
    }

    /**
     * Get current database connection or transaction
     */
    override getDatabase(): InMemoryDatabase | InMemoryTransaction {
        return this.currentTransaction ?? this.getActualDatabase();
    }

    /**
     * Execute work within a transaction
     */
    override async startTransaction<T>(work: () => Promise<T>): Promise<T> {
        return await this.getActualDatabase().transaction(
            async (transaction) => {
                this.currentTransaction = transaction;
                try {
                    const result = await work();
                    return result;
                } finally {
                    this.currentTransaction = undefined;
                }
            },
        );
    }
}
