import { uuid, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from './iam.db-schema';
import { organizationalResourcesTable } from './organizational-resources.table';
import { relations } from 'drizzle-orm';
import { policyBindingsTable } from './policy-bindings.table';
import { POLICIES_RESOURCE_NAME } from '@meadsoft/iam-contracts';

export const policiesTable = iamSchema.table(POLICIES_RESOURCE_NAME, {
    type: varchar({ length: 16 }).notNull(),
    organizationalResourceId: uuid()
        .notNull()
        .references(() => organizationalResourcesTable.id, {
            onDelete: 'cascade',
        }),
    ...entityColumns,
});

export const policiesRelations = relations(policiesTable, ({ one, many }) => ({
    organizationalResource: one(organizationalResourcesTable, {
        fields: [policiesTable.organizationalResourceId],
        references: [organizationalResourcesTable.id],
    }),
    policyBindings: many(policyBindingsTable),
}));
