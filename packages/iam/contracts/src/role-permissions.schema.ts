import { z } from 'zod';

export const ROLES_PERMISSIONS_RESOURCE_NAME = 'RolePermissions';

export const RolePermissionSchema = z.object({
    roleId: z.string().nonempty(),
    permissionId: z.string().nonempty(),
});
export type IRolePermission = z.infer<typeof RolePermissionSchema>;
