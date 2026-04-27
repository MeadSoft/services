import { uuid, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';
import { organizationalResourcesTable } from './organizational-resources.table';

export const POLICIES_TABLE_NAME = 'policies';

export const policiesTable = iamSchema.table(POLICIES_TABLE_NAME, {
    type: varchar({ length: 16 }).notNull(),
    organizationalResourceId: uuid()
        .notNull()
        .references(() => organizationalResourcesTable.id, {
            onDelete: 'cascade',
        }),
    ...entityColumns,
});
