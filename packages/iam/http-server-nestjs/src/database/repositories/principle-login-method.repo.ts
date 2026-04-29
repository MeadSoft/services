import { EMPTY_LENGTH, FIRST_INDEX, ZodSchema } from '@meadsoft/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import {
    IPrincipleLoginMethod,
    PrincipleLoginMethodSchema,
} from '@meadsoft/iam-contracts';
import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
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

    async findByPrincipleId(
        principleId: string,
    ): Promise<IPrincipleLoginMethod[]> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(principleLoginMethodsTable)
            .where(eq(principleLoginMethodsTable.principleId, principleId));
        return rows.map((row) => this.parseResult(row));
    }

    async findByPrincipleIdAndProvider(
        principleId: string,
        provider: string,
    ): Promise<IPrincipleLoginMethod | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(principleLoginMethodsTable)
            .where(
                and(
                    eq(principleLoginMethodsTable.principleId, principleId),
                    eq(principleLoginMethodsTable.provider, provider),
                ),
            );
        if (rows.length === EMPTY_LENGTH) return null;
        return this.parseResult(rows[FIRST_INDEX]);
    }

    async findByEmail(email: string): Promise<IPrincipleLoginMethod | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(principleLoginMethodsTable)
            .where(eq(principleLoginMethodsTable.providerEmail, email));
        if (rows.length === EMPTY_LENGTH) return null;
        return this.parseResult(rows[FIRST_INDEX]);
    }
}
