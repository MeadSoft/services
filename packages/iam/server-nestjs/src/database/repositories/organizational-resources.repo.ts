import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import {
    IOrganizationalResource,
    OrganizationalResourceSchema,
} from '@meadsoft/iam-contracts';
import { organizationalResourcesTable } from '../tables/organizational-resources.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import { IamUnitOfWork } from '../iam-database.service';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrganizationalResourcesRepository extends DrizzlePgCommandRepository<
    IOrganizationalResource,
    string,
    IamDrizzlePgSchema
> {
    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            organizationalResourcesTable,
            new ZodSchema(OrganizationalResourceSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(organizationalResourcesTable.id, id);
    }
}
