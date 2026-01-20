import { Test, TestingModule } from '@nestjs/testing';
import { PostgresUnitOfWork } from './postgres/unit-of-work.service';
import { PostgresDbService } from './postgres/postgres-db.service';
import { InfrastructureConfig } from '../infrastructure.config';
import { DrizzlePgModule } from './drizzle-pg.module';

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

    it('should provide PostgresUnitOfWork', () => {
        const service = module.get<PostgresUnitOfWork>(PostgresUnitOfWork);
        expect(service).toBeDefined();
    });

    it('should provide PostgresDbService', () => {
        const service = module.get<PostgresDbService>(PostgresDbService);
        expect(service).toBeDefined();
    });

    it('should export PostgresUnitOfWork', () => {
        const exportedService =
            module.get<PostgresUnitOfWork>(PostgresUnitOfWork);
        expect(exportedService).toBeDefined();
    });

    it('should export PostgresDbService', () => {
        const exportedService =
            module.get<PostgresDbService>(PostgresDbService);
        expect(exportedService).toBeDefined();
    });
});
