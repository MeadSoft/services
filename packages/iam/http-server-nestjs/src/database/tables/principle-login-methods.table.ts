import { boolean, uuid, varchar } from 'drizzle-orm/pg-core';
import { entityColumns, isoTimestamp } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';
import { principlesTable } from './principles.table';

export const PRINCIPLE_LOGIN_METHODS_TABLE_NAME = 'principle_login_methods';

/**
 * Each row represents one registered login method for a principle (user/service account).
 */
export const principleLoginMethodsTable = iamSchema.table(
    PRINCIPLE_LOGIN_METHODS_TABLE_NAME,
    {
        principleId: uuid()
            .notNull()
            .references(() => principlesTable.id, { onDelete: 'cascade' }),
        provider: varchar({ length: 64 }).notNull(),
        providerPrincipleId: varchar({ length: 255 }),
        providerEmail: varchar({ length: 255 }),
        passwordHash: varchar({ length: 255 }), // for local provider only
        isActive: boolean().default(true).notNull(),
        linkedAt: isoTimestamp('linkedAt').notNull(),
        ...entityColumns,
    },
);
