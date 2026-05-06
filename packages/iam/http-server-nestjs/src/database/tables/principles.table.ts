import { boolean, varchar } from 'drizzle-orm/pg-core';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { iamSchema } from './iam.db-schema';
import { relations } from 'drizzle-orm';
import { policyBindingsTable } from './policy-bindings.table';
import { principleLoginMethodsTable } from './principle-login-methods.table';
import { PRINCIPLES_RESOURCE_NAME } from '@meadsoft/iam-contracts';

export const principlesTable = iamSchema.table(PRINCIPLES_RESOURCE_NAME, {
    email: varchar({ length: 255 }).unique(),
    displayName: varchar({ length: 255 }),
    isActive: boolean().default(true).notNull(),
    ...entityColumns,
});

export const principlesRelations = relations(principlesTable, ({ many }) => ({
    loginMethods: many(principleLoginMethodsTable),
    policyBindings: many(policyBindingsTable),
}));
