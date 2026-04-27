import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { PermissionSchema } from './permission.schema';

// new role
export const NewRoleSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().nullable(),
});
export type INewRole = z.infer<typeof NewRoleSchema>;

// role
export const RoleSchema = z
    .object(NewRoleSchema.shape)
    .extend(EntitySchema.shape);
export type IRole = z.infer<typeof RoleSchema>;

// role with relations
export const RoleWithPermissionsSchema = RoleSchema.extend({
    permissions: z.array(PermissionSchema),
});
export type IRoleWithPermissions = z.infer<typeof RoleWithPermissionsSchema>;
