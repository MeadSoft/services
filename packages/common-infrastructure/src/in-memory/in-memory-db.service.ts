import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from './in-memory-database.schema';

@Injectable()
export class InMemoryDbService {
    // private pool: Pool;
    private readonly _db: InMemoryDatabase = new InMemoryDatabase();

    getDatabase() {
        return this._db;
    }
}
