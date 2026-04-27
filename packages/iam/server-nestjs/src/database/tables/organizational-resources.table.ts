import { text, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from '../iam.db-schema';

export const ORGANIZATIONAL_RESOURCES_TABLE_NAME = 'organizational_resources';

export const organizationalResourcesTable = iamSchema.table(
    ORGANIZATIONAL_RESOURCES_TABLE_NAME,
    {
        name: varchar({ length: 255 }).unique().notNull(),
        description: text(),
        ...entityColumns,
    },
);
