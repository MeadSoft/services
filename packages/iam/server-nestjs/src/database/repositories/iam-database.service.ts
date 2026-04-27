import { Injectable } from '@nestjs/common';
import {
    InfrastructureConfig,
    PostgresDbService,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { authDrizzleSchema } from '../tables/drizzle-schema';
import type { AuthDrizzleSchema } from '../tables/drizzle-schema';

@Injectable()
export class AuthDbService extends PostgresDbService<AuthDrizzleSchema> {
    constructor(infrastructureConfig: InfrastructureConfig) {
        super(authDrizzleSchema, infrastructureConfig);
    }
}

@Injectable()
export class AuthUnitOfWork extends PostgresUnitOfWork<AuthDrizzleSchema> {
    constructor(databaseService: AuthDbService) {
        super(databaseService);
    }
}
