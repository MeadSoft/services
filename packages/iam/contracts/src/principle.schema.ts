import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { PrincipleLoginMethodSchema } from './principle-login-method.schema';

// new principle
export const NewPrincipleSchema = z.object({
    email: z.string().nullable(),
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

// principle with login methods
export const PrincipleWithLoginMethodsSchema = PrincipleSchema.extend({
    loginMethods: z.array(z.object(PrincipleLoginMethodSchema.shape)),
});
export type IPrincipleWithLoginMethods = z.infer<
    typeof PrincipleWithLoginMethodsSchema
>;
