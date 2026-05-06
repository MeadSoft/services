import { ZodSchema } from '@meadsoft/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import {
    IPrincipleLoginMethod,
    PrincipleLoginMethodSchema,
} from '@meadsoft/iam-contracts';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { IamUnitOfWork } from '../iam-database.service';
import { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import { principleLoginMethodsTable } from '../tables/principle-login-methods.table';

@Injectable()
export class PrincipleLoginMethodRepository extends DrizzlePgCommandRepository<
    IPrincipleLoginMethod,
    string,
    IamDrizzlePgSchema
> {
    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            principleLoginMethodsTable,
            new ZodSchema(PrincipleLoginMethodSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(principleLoginMethodsTable.id, id);
    }
}
