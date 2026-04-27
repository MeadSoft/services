import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

export const POLICY_BINDING_RESOURCE_NAME = 'policy-binding';

// new policy binding
export const NewPolicyBindingSchema = z.object({
    policyId: z.uuidv7(),
    roleId: z.uuidv7(),
    principleIds: z.array(z.uuidv7()),
});
export type INewPolicyBinding = z.infer<typeof NewPolicyBindingSchema>;

// policy binding
export const PolicyBindingSchema = z
    .object(NewPolicyBindingSchema.shape)
    .extend(EntitySchema.shape);
export type IPolicyBinding = z.infer<typeof PolicyBindingSchema>;

export class PolicyBinding implements IPolicyBinding {
    id: string;
    policyId: string;
    roleId: string;
    principleIds: string[];
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IPolicyBinding) {
        this.id = data.id;
        this.policyId = data.policyId;
        this.roleId = data.roleId;
        this.principleIds = data.principleIds;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
