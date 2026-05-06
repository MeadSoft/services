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
