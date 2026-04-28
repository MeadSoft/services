import { Injectable } from '@nestjs/common';
import {
    InfrastructureConfig,
    PostgresDbService,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { iamDrizzlePgSchema } from './tables/drizzle-schema';
import type { IamDrizzlePgSchema } from './tables/drizzle-schema';

@Injectable()
export class IamDbService extends PostgresDbService<IamDrizzlePgSchema> {
    constructor(infrastructureConfig: InfrastructureConfig) {
        super(iamDrizzlePgSchema, infrastructureConfig);
    }
}

@Injectable()
export class IamUnitOfWork extends PostgresUnitOfWork<IamDrizzlePgSchema> {
    constructor(databaseService: IamDbService) {
        super(databaseService);
    }
}
