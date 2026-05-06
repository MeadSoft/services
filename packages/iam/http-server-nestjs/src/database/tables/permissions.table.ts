import { text, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from './iam.db-schema';
import { relations } from 'drizzle-orm';
import { rolePermissionsTable } from './role-permissions.table';
import { PERMISSIONS_RESOURCE_NAME } from '@meadsoft/iam-contracts';

export const permissionsTable = iamSchema.table(PERMISSIONS_RESOURCE_NAME, {
    name: varchar({ length: 255 }).unique().notNull(),
    description: text(),
    ...entityColumns,
});

export const permissionsRelations = relations(permissionsTable, ({ many }) => ({
    rolePermissions: many(rolePermissionsTable),
}));
