import { relations } from 'drizzle-orm';
import { principlesTable } from './principles.table';
import { principleLoginMethodsTable } from './principle-login-methods.table';
import { rolesTable } from './roles.table';
import { permissionsTable } from './permissions.table';
import { rolePermissionsTable } from './role-permissions.table';
import { organizationalResourcesTable } from './organizational-resources.table';
import { policiesTable } from './policies.table';
import { policyBindingsTable } from './policy-bindings.table';

export const principlesRelations = relations(principlesTable, ({ many }) => ({
    loginMethods: many(principleLoginMethodsTable),
}));

export const principleLoginMethodsRelations = relations(
    principleLoginMethodsTable,
    ({ one }) => ({
        principle: one(principlesTable, {
            fields: [principleLoginMethodsTable.principleId],
            references: [principlesTable.id],
        }),
    }),
);

export const rolesRelations = relations(rolesTable, ({ many }) => ({
    rolePermissions: many(rolePermissionsTable),
}));

export const permissionsRelations = relations(permissionsTable, ({ many }) => ({
    rolePermissions: many(rolePermissionsTable),
}));

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

export const organizationalResourcesRelations = relations(
    organizationalResourcesTable,
    ({ many }) => ({
        policies: many(policiesTable),
    }),
);

export const policiesRelations = relations(policiesTable, ({ one, many }) => ({
    organizationalResource: one(organizationalResourcesTable, {
        fields: [policiesTable.organizationalResourceId],
        references: [organizationalResourcesTable.id],
    }),
    policyBindings: many(policyBindingsTable),
}));

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

export const iamDrizzlePgSchema = {
    principlesTable,
    principleLoginMethodsTable,
    rolesTable,
    permissionsTable,
    rolePermissionsTable,
    organizationalResourcesTable,
    policiesTable,
    policyBindingsTable,
    principlesRelations,
    principleLoginMethodsRelations,
    rolesRelations,
    permissionsRelations,
    rolePermissionsRelations,
    organizationalResourcesRelations,
    policiesRelations,
    policyBindingsRelations,
};

export type IamDrizzlePgSchema = typeof iamDrizzlePgSchema;
