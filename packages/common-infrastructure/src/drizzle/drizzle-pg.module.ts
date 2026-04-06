import { Module } from '@nestjs/common';
import { InfrastructureProvider } from '../infrastructure.config';
import { DrizzlePgFilterTranslationService } from './postgres/filter-translation.service';
import { FilterTranslationService } from '../contracts';

@Module({
    providers: [
        InfrastructureProvider,
        DrizzlePgFilterTranslationService,
        {
            provide: FilterTranslationService,
            useExisting: DrizzlePgFilterTranslationService,
        },
    ],
    exports: [
        InfrastructureProvider,
        DrizzlePgFilterTranslationService,
        FilterTranslationService,
    ],
})
export class DrizzlePgModule {}
