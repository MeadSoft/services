import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { EMPTY_LENGTH, FIRST_INDEX, ZodSchema } from '@meadsoft/common-server';
import { usersTable } from '../tables/users.table';
import { userLoginMethodsTable } from '../tables/user-login-methods.table';
import type { AuthDrizzleSchema } from '../tables/drizzle-schema';
import {
    IUserAccount,
    IUserLoginMethod,
    UserAccountSchema,
    UserLoginMethodSchema,
} from '@meadsoft/auth-contracts';
import { AuthUnitOfWork } from './auth-database.service';

@Injectable()
export class UserAccountRepository extends DrizzlePgCommandRepository<
    IUserAccount,
    string,
    AuthDrizzleSchema
> {
    constructor(
        unitOfWork: AuthUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            usersTable,
            new ZodSchema(UserAccountSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(usersTable.id, id);
    }

    async findByFirebaseUid(firebaseUid: string): Promise<IUserAccount | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(usersTable)
            .where(eq(usersTable.firebaseUid, firebaseUid));
        if (rows.length === EMPTY_LENGTH) return null;
        return this.parseResult(rows[FIRST_INDEX]);
    }

    async findByEmail(email: string): Promise<IUserAccount | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
        if (rows.length === EMPTY_LENGTH) return null;
        return this.parseResult(rows[FIRST_INDEX]);
    }

    async findPasswordHashByEmail(
        email: string,
    ): Promise<{ id: string; passwordHash: string } | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select({
                id: usersTable.id,
                passwordHash: usersTable.passwordHash,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));
        if (rows.length === EMPTY_LENGTH) return null;
        const row = rows[FIRST_INDEX];
        if (!row.passwordHash) return null;
        return { id: row.id, passwordHash: row.passwordHash };
    }

    async createOneWithPassword(
        user: IUserAccount,
        passwordHash: string,
    ): Promise<IUserAccount> {
        const rows = await this.unitOfWork
            .getDatabase()
            .insert(usersTable)
            .values({ ...user, passwordHash })
            .returning();
        return this.parseResult(rows[FIRST_INDEX]);
    }
}

@Injectable()
export class UserLoginMethodRepository extends DrizzlePgCommandRepository<
    IUserLoginMethod,
    string,
    AuthDrizzleSchema
> {
    constructor(
        unitOfWork: AuthUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            userLoginMethodsTable,
            new ZodSchema(UserLoginMethodSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(userLoginMethodsTable.id, id);
    }

    async findByUserIdAndProvider(
        userId: string,
        provider: string,
    ): Promise<IUserLoginMethod | null> {
        const rows = await this.unitOfWork
            .getDatabase()
            .select()
            .from(userLoginMethodsTable)
            .where(
                and(
                    eq(userLoginMethodsTable.userId, userId),
                    eq(userLoginMethodsTable.provider, provider),
                ),
            );
        if (rows.length === EMPTY_LENGTH) return null;
        return this.parseResult(rows[FIRST_INDEX]);
    }
}
