import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import {
    IPolicyBindingWithRelations,
    PolicyBindingWithRelationsSchema,
} from './policy-binding.schema';
import {
    IOrganizationalResource,
    OrganizationalResourceSchema,
} from './organizational-resource.schema';

export const POLICIES_RESOURCE_NAME = 'Policies';

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

// policy with relations
export type IPolicyWithRelations = IPolicy & {
    policyBindings: IPolicyBindingWithRelations[] | null;
    organizationalResource: IOrganizationalResource | null;
};
export const PolicyWithRelationsSchema = z.lazy(() =>
    PolicySchema.extend({
        policyBindings: z.array(PolicyBindingWithRelationsSchema).nullable(),
        organizationalResource: OrganizationalResourceSchema.nullable(),
    }),
);

export class PolicyWithRelations
    extends Policy
    implements IPolicyWithRelations
{
    policyBindings: IPolicyBindingWithRelations[] | null;
    organizationalResource: IOrganizationalResource | null;

    constructor(data: IPolicyWithRelations) {
        super(data);
        this.policyBindings = data.policyBindings;
        this.organizationalResource = data.organizationalResource;
    }
}
