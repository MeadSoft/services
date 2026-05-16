import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { PrincipleLoginMethodSchema } from './principle-login-method.schema';
import { PolicyBindingWithRelationsSchema } from './policy-binding.schema';

export const PRINCIPLES_RESOURCE_NAME = 'Principles';

// new principle
export const NewPrincipleSchema = z.object({
    email: z.email().nullable(),
    displayName: z.string().nullable(),
});
export type INewPrinciple = z.infer<typeof NewPrincipleSchema>;

// principle
export const PrincipleSchema = z
    .object({
        isActive: z.boolean(),
    })
    .extend(NewPrincipleSchema.shape)
    .extend(EntitySchema.shape);
export type IPrinciple = z.infer<typeof PrincipleSchema>;

// principle with relations
export const PrincipleWithRelationsSchema = PrincipleSchema.extend({
    loginMethods: z.array(PrincipleLoginMethodSchema).nullable(),
    policyBindings: z.array(PolicyBindingWithRelationsSchema).nullable(),
});
export type IPrincipleWithRelations = z.infer<
    typeof PrincipleWithRelationsSchema
>;

export class Principle implements IPrinciple {
    id: string;
    email: string | null;
    displayName: string | null;
    isActive: boolean;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IPrinciple) {
        this.id = data.id;
        this.email = data.email;
        this.displayName = data.displayName;
        this.isActive = data.isActive;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}

export class PrincipleWithRelations implements IPrincipleWithRelations {
    id: string;
    email: string | null;
    displayName: string | null;
    isActive: boolean;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;
    loginMethods: z.infer<typeof PrincipleLoginMethodSchema>[] | null;
    policyBindings: z.infer<typeof PolicyBindingWithRelationsSchema>[] | null;

    constructor(data: IPrincipleWithRelations) {
        this.id = data.id;
        this.email = data.email;
        this.displayName = data.displayName;
        this.isActive = data.isActive;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
        this.loginMethods = data.loginMethods;
        this.policyBindings = data.policyBindings;
    }
}
