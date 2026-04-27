import { z } from 'zod';

export const RolePermissionSchema = z.object({
    roleId: z.string().nonempty(),
    permissionId: z.string().nonempty(),
});
export type IRolePermission = z.infer<typeof RolePermissionSchema>;
