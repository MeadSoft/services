import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { IPermission, PermissionSchema } from '@meadsoft/iam-contracts';
import { permissionsTable } from '../tables/permissions.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import { IamUnitOfWork } from '../iam-database.service';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class PermissionsRepository extends DrizzlePgCommandRepository<
    IPermission,
    string,
    IamDrizzlePgSchema
> {
    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            permissionsTable,
            new ZodSchema(PermissionSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(permissionsTable.id, id);
    }
}
