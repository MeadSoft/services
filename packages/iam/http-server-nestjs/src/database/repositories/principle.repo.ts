import { Injectable } from '@nestjs/common';
import { eq, Table } from 'drizzle-orm';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import {
    EMPTY_LENGTH,
    FIRST_INDEX,
    IFilter,
    parseResult,
    parseResults,
    ZodSchema,
} from '@meadsoft/common';
import { principlesTable } from '../tables/principles.table';
import { principleLoginMethodsTable } from '../tables/principle-login-methods.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import {
    IPrincipleLoginMethod,
    PrincipleSchema,
    IPrinciple,
    IPrincipleWithRelations,
    PrincipleWithRelationsSchema,
} from '@meadsoft/iam-contracts';
import { IamUnitOfWork } from '../iam-database.service';
import { Err, Ok, Result } from 'ts-results';
import { policiesTable } from '../tables/policies.table';
import { organizationalResourcesTable } from '../tables/organizational-resources.table';
import { permissionsTable } from '../tables/permissions.table';
import { rolePermissionsTable } from '../tables/role-permissions.table';
import { rolesTable } from '../tables/roles.table';
import { policyBindingsTable } from '../tables/policy-bindings.table';

@Injectable()
export class PrincipleRepository extends DrizzlePgCommandRepository<
    IPrinciple,
    string,
    IamDrizzlePgSchema
> {
    principleWithRelationsSchema = new ZodSchema(PrincipleWithRelationsSchema);

    constructor(
        unitOfWork: IamUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            principlesTable,
            new ZodSchema(PrincipleSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(principlesTable.id, id);
    }

    async findByEmail(email: string): Promise<IPrinciple | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(principlesTable)
            .where(eq(principlesTable.email, email));
        if (rows.length === EMPTY_LENGTH) return null;
        return parseResult(rows[FIRST_INDEX], this.schema);
    }

    async createWithLoginMethods(
        principle: IPrinciple,
        loginMethods: IPrincipleLoginMethod[],
    ): Promise<IPrinciple> {
        const db = this.unitOfWork.getDatabase();
        await db.transaction(async (tx) => {
            await tx.insert(principlesTable).values(principle);
            if (loginMethods.length > EMPTY_LENGTH) {
                await tx
                    .insert(principleLoginMethodsTable)
                    .values(loginMethods);
            }
        });
        return principle;
    }

    async findManyWithRelations(
        filters: IFilter[] | null,
    ): Promise<Result<IPrincipleWithRelations[], Error>> {
        const relations = this.getRelationsObject();
        const sqlFilterResult = this.filterTranslationService.translate(
            filters,
            [principlesTable],
        );
        if (sqlFilterResult.err) {
            return Err(sqlFilterResult.val);
        }
        const sqlFilters = sqlFilterResult.unwrap();
        const database = this.unitOfWork.getDatabase();
        const rawItems = await database.query.principlesTable.findMany({
            where: sqlFilters,
            with: relations.relationsOptions,
        });

        const results: IPrincipleWithRelations[] = parseResults(
            rawItems,
            this.principleWithRelationsSchema,
        );
        return Ok(results);
    }

    async findFirstWithRelations(
        filters: IFilter[] | null,
    ): Promise<Result<IPrincipleWithRelations | null, Error>> {
        const relations = this.getRelationsObject();
        const sqlFilterResult = this.filterTranslationService.translate(
            filters,
            [principlesTable],
        );
        if (sqlFilterResult.err) {
            return Err(sqlFilterResult.val);
        }
        const sqlFilters = sqlFilterResult.val;
        const database = this.unitOfWork.getDatabase();
        const rawItem = await database.query.principlesTable.findFirst({
            where: sqlFilters,
            with: relations.relationsOptions,
        });
        if (rawItem === undefined) {
            return Ok(null);
        }
        const result = parseResult(rawItem, this.principleWithRelationsSchema);
        return Ok(result);
    }

    /**
     * TODO: find a way to statically type the returned object of this method.
     *       drizzles table API has static type checking for it on the table.findFirst
     *       and findMany methods
     */
    getRelationsObject(): { relationsOptions: object; relatedTables: Table[] } {
        return {
            relationsOptions: {
                loginMethods: true,
                policyBindings: {
                    with: {
                        role: {
                            with: {
                                rolePermissions: {
                                    with: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                        policy: {
                            with: {
                                organizationalResource: true,
                            },
                        },
                    },
                },
            },
            relatedTables: [
                principleLoginMethodsTable,
                policyBindingsTable,
                policiesTable,
                organizationalResourcesTable,
                rolesTable,
                rolePermissionsTable,
                permissionsTable,
            ],
        };
    }
}
