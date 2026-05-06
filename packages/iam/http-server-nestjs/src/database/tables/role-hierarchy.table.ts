import { iamSchema } from './iam.db-schema';
import { primaryKey, uuid } from 'drizzle-orm/pg-core';
import { rolesTable } from './roles.table';

export const ROLES_HIERARCHY_TABLE_NAME = 'RolesHierarchy';

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
