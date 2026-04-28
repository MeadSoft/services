import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';
import { text, varchar } from 'drizzle-orm/pg-core';

export const ROLES_TABLE_NAME = 'roles';

/**
 * Stores every role that can be assigned to a principle
 */
export const rolesTable = iamSchema.table(ROLES_TABLE_NAME, {
    name: varchar({ length: 255 }).unique().notNull(),
    description: text(),
    ...entityColumns,
});
