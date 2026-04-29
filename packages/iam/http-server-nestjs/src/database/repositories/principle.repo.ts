import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { EMPTY_LENGTH, FIRST_INDEX, ZodSchema } from '@meadsoft/common';
import { principlesTable } from '../tables/principles.table';
import { principleLoginMethodsTable } from '../tables/principle-login-methods.table';
import type { IamDrizzlePgSchema } from '../tables/drizzle-schema';
import {
    IPrincipleLoginMethod,
    PrincipleSchema,
    IPrinciple,
} from '@meadsoft/iam-contracts';
import { IamUnitOfWork } from '../iam-database.service';

@Injectable()
export class PrincipleRepository extends DrizzlePgCommandRepository<
    IPrinciple,
    string,
    IamDrizzlePgSchema
> {
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
        return this.parseResult(rows[FIRST_INDEX]);
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
}
