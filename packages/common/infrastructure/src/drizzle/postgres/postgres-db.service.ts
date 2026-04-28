import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InfrastructureConfig } from '../../infrastructure.config';
// import { Pool } from 'pg';

@Injectable()
export class PostgresDbService<
    TSchema extends Record<string, unknown> = Record<string, never>,
> {
    // private pool: Pool;
    private _db: NodePgDatabase<TSchema> | null = null;

    constructor(
        private readonly schema: TSchema,
        private readonly infrastructureConfig: InfrastructureConfig,
    ) {
        // for some reason, when using the pool the client is undefined
        // this.pool = new Pool({
        //     connectionString: this.infrastructureConfig.DATABASE_URL,
        //     max: 20,
        //     idleTimeoutMillis: 30000,
        //     connectionTimeoutMillis: 2000,
        // });
    }

    getDatabase() {
        this._db ??= drizzle(this.infrastructureConfig.DATABASE_URL, {
            schema: this.schema,
        });
        // for some reason, when using the pool the client is undefined
        // this._db = drizzle({ client: this.pool });
        return this._db;
    }

    // async onModuleDestroy() {
    //     await this.pool.end();
    // }
}
