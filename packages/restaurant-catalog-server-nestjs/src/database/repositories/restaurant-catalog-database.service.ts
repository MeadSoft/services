import { Injectable } from '@nestjs/common';
import {
    InfrastructureConfig,
    PostgresDbService,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { restaurantCatalogDrizzleSchema } from '../tables/drizzle-schema';
import type { RestaurantCatalogDrizzleSchema } from '../tables/drizzle-schema';

@Injectable()
export class RestaurantCatalogDbService extends PostgresDbService<RestaurantCatalogDrizzleSchema> {
    constructor(infrastructureConfig: InfrastructureConfig) {
        super(restaurantCatalogDrizzleSchema, infrastructureConfig);
    }
}

@Injectable()
export class RestaurantCatalogUnitOfWork extends PostgresUnitOfWork<RestaurantCatalogDrizzleSchema> {
    constructor(databaseService: RestaurantCatalogDbService) {
        super(databaseService);
    }
}
