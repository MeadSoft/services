import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { Permission, PermissionSchema } from './permission.schema';

export const ROLES_RESOURCE_NAME = 'Roles';

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
export type IRoleWithRelations = IRole & {
    permissions: Permission[];
    parentRoles: IRoleWithRelations[] | null;
};
export const RoleWithRelationsSchema: z.ZodType<IRoleWithRelations> = z.lazy(
    () =>
        RoleSchema.extend({
            permissions: z.array(PermissionSchema),
            parentRoles: z
                .array(z.lazy(() => RoleWithRelationsSchema))
                .nullable(),
        }),
);

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
