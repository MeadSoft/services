import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { Size, SizeSchema } from '@meadsoft/restaurant-catalog-contracts';
import { sizesTable } from '../tables/sizes.table';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class SizesRepository extends DrizzlePgCommandRepository<Size> {
    constructor(protected override unitOfWork: PostgresUnitOfWork) {
        super(sizesTable, new ZodSchema(SizeSchema), unitOfWork);
    }

    override equals(id: string) {
        return eq(sizesTable.id, id);
    }
}
