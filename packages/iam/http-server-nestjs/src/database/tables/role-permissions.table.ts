import { primaryKey, uuid } from 'drizzle-orm/pg-core';
import { iamSchema } from '../iam.db-schema';
import { rolesTable } from './roles.table';
import { permissionsTable } from './permissions.table';

export const ROLE_PERMISSIONS_TABLE_NAME = 'role_permissions';

export const rolePermissionsTable = iamSchema.table(
    ROLE_PERMISSIONS_TABLE_NAME,
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
