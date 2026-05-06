import { primaryKey, uuid } from 'drizzle-orm/pg-core';
import { iamSchema } from './iam.db-schema';
import { rolesTable } from './roles.table';
import { permissionsTable } from './permissions.table';
import { relations } from 'drizzle-orm';
import { ROLES_PERMISSIONS_RESOURCE_NAME } from '@meadsoft/iam-contracts';

export const rolePermissionsTable = iamSchema.table(
    ROLES_PERMISSIONS_RESOURCE_NAME,
    {
        roleId: uuid()
            .notNull()
            .references(() => rolesTable.id, { onDelete: 'cascade' }),
        permissionId: uuid()
            .notNull()
            .references(() => permissionsTable.id, { onDelete: 'cascade' }),
    },
    (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const rolePermissionsRelations = relations(
    rolePermissionsTable,
    ({ one }) => ({
        role: one(rolesTable, {
            fields: [rolePermissionsTable.roleId],
            references: [rolesTable.id],
        }),
        permission: one(permissionsTable, {
            fields: [rolePermissionsTable.permissionId],
            references: [permissionsTable.id],
        }),
    }),
);
