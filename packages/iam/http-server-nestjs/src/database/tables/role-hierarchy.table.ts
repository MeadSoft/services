import { iamSchema } from '../iam.db-schema';
import { primaryKey, uuid } from 'drizzle-orm/pg-core';
import { rolesTable } from './roles.table';

export const ROLES_HIERARCHY_TABLE_NAME = 'roles_hierarchy';

/**
 * Stores the hierarchy of roles, defining parent-child relationships between roles
 */
export const rolesHierarchyTable = iamSchema.table(
    ROLES_HIERARCHY_TABLE_NAME,
    {
        parentRoleId: uuid()
            .notNull()
            .references(() => rolesTable.id, { onDelete: 'cascade' }),
        childRoleId: uuid()
            .notNull()
            .references(() => rolesTable.id, { onDelete: 'cascade' }),
    },
    (table) => [
        primaryKey({ columns: [table.parentRoleId, table.childRoleId] }),
    ],
);
