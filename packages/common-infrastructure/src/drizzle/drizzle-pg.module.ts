import { Module } from '@nestjs/common';
import { PostgresUnitOfWork } from './postgres/unit-of-work.service';
import { PostgresDbService } from './postgres/postgres-db.service';
import { InfrastructureProvider } from '../infrastructure.config';
import { UnitOfWorkService } from '../contracts/unit-of-work.schema';
import { DrizzlePgFilterTranslationService } from './postgres/filter-translation.service';
import { FilterTranslationService } from '../contracts';

@Module({
    providers: [
        InfrastructureProvider,
        PostgresDbService,
        PostgresUnitOfWork,
        { provide: UnitOfWorkService, useExisting: PostgresUnitOfWork },
        DrizzlePgFilterTranslationService,
        {
            provide: FilterTranslationService,
            useExisting: DrizzlePgFilterTranslationService,
        },
    ],
    exports: [
        InfrastructureProvider,
        PostgresUnitOfWork,
        PostgresDbService,
        UnitOfWorkService,
        DrizzlePgFilterTranslationService,
    ],
})
export class DrizzlePgModule {}
