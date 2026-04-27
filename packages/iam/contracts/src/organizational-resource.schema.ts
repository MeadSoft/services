import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

// new organizational resource
export const NewOrganizationalResourceSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().nullable(),
});
export type INewOrganizationalResource = z.infer<
    typeof NewOrganizationalResourceSchema
>;

// organizational resource
export const OrganizationalResourceSchema = z
    .object(NewOrganizationalResourceSchema.shape)
    .extend(EntitySchema.shape);
export type IOrganizationalResource = z.infer<
    typeof OrganizationalResourceSchema
>;
