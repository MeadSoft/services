import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

// new policy role principles
export const NewPolicyBindingSchema = z.object({
    policyId: z.uuidv7(),
    roleId: z.uuidv7(),
    principleIds: z.array(z.uuidv7()),
});
export type INewPolicyBinding = z.infer<typeof NewPolicyBindingSchema>;

// policy role principles
export const PolicyBindingSchema = z
    .object(NewPolicyBindingSchema.shape)
    .extend(EntitySchema.shape);
export type IPolicyBinding = z.infer<typeof PolicyBindingSchema>;
