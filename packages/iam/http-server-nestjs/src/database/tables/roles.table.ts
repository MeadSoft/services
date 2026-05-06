import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from './iam.db-schema';
import { text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { rolePermissionsTable } from './role-permissions.table';
import { ROLES_RESOURCE_NAME } from '@meadsoft/iam-contracts';

/**
 * Stores every role that can be assigned to a principle
 */
export const rolesTable = iamSchema.table(ROLES_RESOURCE_NAME, {
    name: varchar({ length: 255 }).unique().notNull(),
    description: text(),
    ...entityColumns,
});

export const rolesRelations = relations(rolesTable, ({ many }) => ({
    rolePermissions: many(rolePermissionsTable),
}));
