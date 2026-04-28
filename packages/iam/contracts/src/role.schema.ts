import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { PermissionSchema } from './permission.schema';

export const ROLE_RESOURCE_NAME = 'role';

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
export const RoleWithRelationsSchema = RoleSchema.extend({
    permissions: z.array(PermissionSchema),
    parentRoles: z.array(RoleSchema).nullable(),
});
export type IRoleWithRelations = z.infer<typeof RoleWithRelationsSchema>;

export class Role implements IRole {
    id: string;
    name: string;
    description: string | null;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IRole) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
