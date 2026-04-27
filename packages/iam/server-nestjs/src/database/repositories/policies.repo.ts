import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { IPolicy, PolicySchema } from '@meadsoft/iam-contracts';
import { policiesTable } from '../tables/policies.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import { IamUnitOfWork } from '../iam-database.service';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class PoliciesRepository extends DrizzlePgCommandRepository<
    IPolicy,
    string,
    IamDrizzlePgSchema
> {
    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            policiesTable,
            new ZodSchema(PolicySchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(policiesTable.id, id);
    }
}
