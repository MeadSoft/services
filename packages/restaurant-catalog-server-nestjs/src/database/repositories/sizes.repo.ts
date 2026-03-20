import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { Size, SizeSchema } from '@meadsoft/restaurant-catalog-contracts';
import { sizesTable } from '../tables/sizes.table';
import { ZodSchema } from '@meadsoft/common-server';
import { eq } from 'drizzle-orm';

@Injectable()
export class SizesRepository extends DrizzlePgCommandRepository<Size> {
    constructor(
        protected override unitOfWork: PostgresUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            sizesTable,
            new ZodSchema(SizeSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(sizesTable.id, id);
    }
}
