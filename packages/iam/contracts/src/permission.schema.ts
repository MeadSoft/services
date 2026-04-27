import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

export const PermissionSchema = z
    .object({
        name: z.string().nonempty(),
        description: z.string().nullable(),
    })
    .extend(EntitySchema.shape);

export type IPermission = z.infer<typeof PermissionSchema>;
