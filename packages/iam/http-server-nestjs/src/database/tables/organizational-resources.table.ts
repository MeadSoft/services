import { text, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from './iam.db-schema';
import { relations } from 'drizzle-orm';
import { policiesTable } from './policies.table';
import { ORGANIZATIONAL_RESOURCES_RESOURCE_NAME } from '@meadsoft/iam-contracts';

export const organizationalResourcesTable = iamSchema.table(
    ORGANIZATIONAL_RESOURCES_RESOURCE_NAME,
    {
        name: varchar({ length: 255 }).unique().notNull(),
        description: text(),
        ...entityColumns,
    },
);

export const organizationalResourcesRelations = relations(
    organizationalResourcesTable,
    ({ many }) => ({
        policies: many(policiesTable),
    }),
);
