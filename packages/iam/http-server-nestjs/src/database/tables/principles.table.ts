import { boolean, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';

export const PRINCIPLES_TABLE_NAME = 'principles';

/**
 * Stores every authenticated identity that has logged in to the application.
 */
export const principlesTable = iamSchema.table(PRINCIPLES_TABLE_NAME, {
    email: varchar({ length: 255 }).unique(),
    displayName: varchar({ length: 255 }),
    isActive: boolean().default(true).notNull(),
    ...entityColumns,
});
