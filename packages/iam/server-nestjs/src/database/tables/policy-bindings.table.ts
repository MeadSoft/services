import { uuid } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';
import { policiesTable } from './policies.table';
import { rolesTable } from './roles.table';

export const POLICY_BINDINGS_TABLE_NAME = 'policy_bindings';

export const policyBindingsTable = iamSchema.table(POLICY_BINDINGS_TABLE_NAME, {
    policyId: uuid()
        .notNull()
        .references(() => policiesTable.id, { onDelete: 'cascade' }),
    roleId: uuid()
        .notNull()
        .references(() => rolesTable.id, { onDelete: 'cascade' }),
    principleIds: uuid().array().notNull(),
    ...entityColumns,
});
