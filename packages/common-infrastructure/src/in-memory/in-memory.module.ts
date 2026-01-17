import { Module } from '@nestjs/common';
import { InfrastructureProvider } from '../infrastructure.config';
import { UnitOfWorkService } from '../unit-of-work.service';
import { InMemoryUnitOfWork } from './unit-of-work.service';
import { InMemoryDbService } from './in-memory-db.service';

@Module({
    providers: [
        InfrastructureProvider,
        { provide: UnitOfWorkService, useExisting: InMemoryUnitOfWork },
        InMemoryDbService,
    ],
    exports: [InfrastructureProvider, InMemoryUnitOfWork, UnitOfWorkService],
})
export class InMemoryModule {}
