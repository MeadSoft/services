import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { EMPTY_LENGTH, FIRST_INDEX, ZodSchema } from '@meadsoft/common';
import { principlesTable } from '../tables/principles.table';
import { principleLoginMethodsTable } from '../tables/principle-login-methods.table';
import type { AuthDrizzleSchema } from '../tables/drizzle-schema';
import {
    IPrincipleLoginMethod,
    PrincipleSchema,
    PrincipleLoginMethodSchema,
    IPrinciple,
} from '@meadsoft/iam-contracts';
import { AuthUnitOfWork } from './iam-database.service';

@Injectable()
export class PrincipleRepository extends DrizzlePgCommandRepository<
    IPrinciple,
    string,
    AuthDrizzleSchema
> {
    constructor(
        unitOfWork: AuthUnitOfWork,
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
        return this.parseResult(rows[FIRST_INDEX]);
    }
}

@Injectable()
export class PrincipleLoginMethodRepository extends DrizzlePgCommandRepository<
    IPrincipleLoginMethod,
    string,
    AuthDrizzleSchema
> {
    constructor(
        unitOfWork: AuthUnitOfWork,
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
}
