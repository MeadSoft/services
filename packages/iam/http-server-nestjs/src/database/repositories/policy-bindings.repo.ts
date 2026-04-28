import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { IPolicyBinding, PolicyBindingSchema } from '@meadsoft/iam-contracts';
import { policyBindingsTable } from '../tables/policy-bindings.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import { IamUnitOfWork } from '../iam-database.service';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class PolicyBindingsRepository extends DrizzlePgCommandRepository<
    IPolicyBinding,
    string,
    IamDrizzlePgSchema
> {
    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            policyBindingsTable,
            new ZodSchema(PolicyBindingSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(policyBindingsTable.id, id);
    }
}
