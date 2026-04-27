import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { IRole, RoleSchema } from '@meadsoft/iam-contracts';
import { rolesTable } from '../tables/roles.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import { IamUnitOfWork } from '../iam-database.service';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class RolesRepository extends DrizzlePgCommandRepository<
    IRole,
    string,
    IamDrizzlePgSchema
> {
    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            rolesTable,
            new ZodSchema(RoleSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(rolesTable.id, id);
    }

    async findOneWithPermissions(id: string) {
        const database = this.unitOfWork.getDatabase();
        const result = await database.query.rolesTable.findFirst({
            where: eq(rolesTable.id, id),
            with: {
                rolePermissions: {
                    with: {
                        permission: true,
                    },
                },
            },
        });
        if (!result) return null;
        return {
            ...result,
            permissions: result.rolePermissions.map((rp) => rp.permission),
        };
    }
}
