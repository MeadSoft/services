import { Injectable } from '@nestjs/common';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresDbService } from './postgres-db.service';
import { UnitOfWorkService } from '../../contracts/unit-of-work.schema';

type DbOrTransaction<
    TSchema extends Record<string, unknown> = Record<string, never>,
> =
    | NodePgDatabase<TSchema>
    | PgTransaction<
          PgQueryResultHKT,
          TSchema,
          ExtractTablesWithRelations<TSchema>
      >;

@Injectable()
export class PostgresUnitOfWork<
    TSchema extends Record<string, unknown> = Record<string, never>,
> extends UnitOfWorkService<NodePgDatabase<TSchema>, DbOrTransaction<TSchema>> {
    constructor(databaseService: PostgresDbService<TSchema>) {
        super(() => databaseService.getDatabase());
    }

    /**
     * Get current database connection or transaction
     */
    override getDatabase(): DbOrTransaction<TSchema> {
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
