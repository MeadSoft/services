import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { IRoleWithRelations, RoleWithRelationsSchema } from './role.schema';
import { IPrinciple, PrincipleSchema } from './principle.schema';
import {
    IPolicyWithRelations,
    PolicyWithRelationsSchema,
} from './policy.schema';

export const POLICY_BINDINGS_RESOURCE_NAME = 'PolicyBindings';

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

// policy binding with relations
export type IPolicyBindingWithRelations = IPolicyBinding & {
    role: IRoleWithRelations | null;
    principles: IPrinciple[] | null;
    policy: IPolicyWithRelations | null;
};
export const PolicyBindingWithRelationsSchema: z.ZodType<IPolicyBindingWithRelations> =
    z.lazy(() =>
        PolicyBindingSchema.extend({
            role: RoleWithRelationsSchema.nullable(),
            principles: z.array(PrincipleSchema).nullable(),
            policy: PolicyWithRelationsSchema.nullable(),
        }),
    );
export class PolicyBindingWithRelations
    extends PolicyBinding
    implements IPolicyBindingWithRelations
{
    role: IRoleWithRelations | null;
    principles: IPrinciple[] | null;
    policy: IPolicyWithRelations | null;

    constructor(data: IPolicyBindingWithRelations) {
        super(data);
        this.role = data.role;
        this.principles = data.principles;
        this.policy = data.policy;
    }
}
