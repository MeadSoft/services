import { uuid } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from './iam.db-schema';
import { policiesTable } from './policies.table';
import { rolesTable } from './roles.table';
import { relations } from 'drizzle-orm';
import { POLICY_BINDINGS_RESOURCE_NAME } from '@meadsoft/iam-contracts';

export const policyBindingsTable = iamSchema.table(
    POLICY_BINDINGS_RESOURCE_NAME,
    {
        policyId: uuid()
            .notNull()
            .references(() => policiesTable.id, { onDelete: 'cascade' }),
        roleId: uuid()
            .notNull()
            .references(() => rolesTable.id, { onDelete: 'cascade' }),
        principleIds: uuid().array().notNull(),
        ...entityColumns,
    },
);

export const policyBindingsRelations = relations(
    policyBindingsTable,
    ({ one }) => ({
        policy: one(policiesTable, {
            fields: [policyBindingsTable.policyId],
            references: [policiesTable.id],
        }),
        role: one(rolesTable, {
            fields: [policyBindingsTable.roleId],
            references: [rolesTable.id],
        }),
    }),
);
