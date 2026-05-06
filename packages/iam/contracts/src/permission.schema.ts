import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

export const PERMISSIONS_RESOURCE_NAME = 'Permissions';

// new permission
export const NewPermissionSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().nullable(),
});
export type INewPermission = z.infer<typeof NewPermissionSchema>;

// permission
export const PermissionSchema = NewPermissionSchema.extend(EntitySchema.shape);
export type IPermission = z.infer<typeof PermissionSchema>;

export class Permission implements IPermission {
    id: string;
    name: string;
    description: string | null;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IPermission) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
