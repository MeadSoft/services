import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

export const POLICY_RESOURCE_NAME = 'policy';

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

export class Policy implements IPolicy {
    id: string;
    type: 'allow' | 'deny';
    organizationalResourceId: string;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IPolicy) {
        this.id = data.id;
        this.type = data.type;
        this.organizationalResourceId = data.organizationalResourceId;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
