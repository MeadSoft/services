import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

export type PolicyTypeEnum = 'allow' | 'deny';

// new policy
export const NewPolicySchema = z.object({
    type: z.enum(['allow', 'deny'] as PolicyTypeEnum[]),
    organizationalResourceId: z.uuidv7(),
});
export type INewPolicy = z.infer<typeof NewPolicySchema>;

// policy
export const PolicySchema = z
    .object(NewPolicySchema.shape)
    .extend(EntitySchema.shape);
export type IPolicy = z.infer<typeof PolicySchema>;
