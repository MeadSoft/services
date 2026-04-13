import { boolean, uuid, varchar } from 'drizzle-orm/pg-core';
import { isoTimestamp } from '@meadsoft/common-infrastructure';
import { authSchema } from '../auth.db-schema';
import { usersTable } from './users.table';

export const USER_LOGIN_METHODS_TABLE_NAME = 'user_login_methods';

/**
 * Each row represents one registered login method for a user.
 * A user may have both a 'local' (email/password) and 'google' row, supporting
 * multiple providers per account. Additional providers can be added by extending
 * the provider check in UserAccountService.
 */
export const userLoginMethodsTable = authSchema.table(
    USER_LOGIN_METHODS_TABLE_NAME,
    {
        id: uuid().notNull().primaryKey().defaultRandom(),
        userId: uuid()
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        /** 'local' = Firebase email/password, 'google' = Google OAuth via Firebase */
        provider: varchar({ length: 64 }).notNull(),
        /** Firebase UID issued for this provider session */
        providerUserId: varchar({ length: 255 }),
        /** Email address associated with this specific provider */
        providerEmail: varchar({ length: 255 }),
        isActive: boolean().default(true).notNull(),
        linkedAt: isoTimestamp('linkedAt').notNull(),
    },
);
