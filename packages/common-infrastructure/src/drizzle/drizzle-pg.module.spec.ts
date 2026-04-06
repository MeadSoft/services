import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureConfig } from '../infrastructure.config';
import { DrizzlePgModule } from './drizzle-pg.module';
import { DrizzlePgFilterTranslationService } from './postgres/filter-translation.service';
import { FilterTranslationService } from '../contracts';

describe('DrizzlePgModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DrizzlePgModule],
        })
            .overrideProvider(InfrastructureConfig)
            .useValue(new InfrastructureConfig())
            .compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide DrizzlePgFilterTranslationService', () => {
        const service = module.get<DrizzlePgFilterTranslationService>(
            DrizzlePgFilterTranslationService,
        );
        expect(service).toBeDefined();
    });

    it('should provide FilterTranslationService', () => {
        const service = module.get<FilterTranslationService>(
            FilterTranslationService,
        );
        expect(service).toBeDefined();
    });

    it('should export DrizzlePgFilterTranslationService', () => {
        const exportedService = module.get<DrizzlePgFilterTranslationService>(
            DrizzlePgFilterTranslationService,
        );
        expect(exportedService).toBeDefined();
    });

    it('should export FilterTranslationService', () => {
        const exportedService = module.get<FilterTranslationService>(
            FilterTranslationService,
        );
        expect(exportedService).toBeDefined();
    });
});
