import { principlesRelations, principlesTable } from './principles.table';
import {
    principleLoginMethodsRelations,
    principleLoginMethodsTable,
} from './principle-login-methods.table';
import { rolesRelations, rolesTable } from './roles.table';
import { permissionsRelations, permissionsTable } from './permissions.table';
import {
    rolePermissionsRelations,
    rolePermissionsTable,
} from './role-permissions.table';
import {
    organizationalResourcesRelations,
    organizationalResourcesTable,
} from './organizational-resources.table';
import { policiesRelations, policiesTable } from './policies.table';
import {
    policyBindingsRelations,
    policyBindingsTable,
} from './policy-bindings.table';

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
