import { text, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';

export const PERMISSIONS_TABLE_NAME = 'permissions';

export const permissionsTable = iamSchema.table(PERMISSIONS_TABLE_NAME, {
    name: varchar({ length: 255 }).unique().notNull(),
    description: text(),
    ...entityColumns,
});
