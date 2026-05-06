import { EntitySchema } from '@meadsoft/common';
import { z } from 'zod';
import { PrincipleWithRelationsSchema } from './principle.schema';

export type LoginProviderEnum = 'google' | 'local';

export const PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME = 'PrincipleLoginMethods';

// new login method
export const NewPrincipleLoginMethodSchema = z.object({
    principleId: z.uuid(),
    provider: z.enum(['google', 'local'] as LoginProviderEnum[]),
    providerPrincipleId: z.string().nullable(),
    providerEmail: z.email().nullable(),
    passwordHash: z.string().nullable(), // for local provider only
});
export type INewPrincipleLoginMethod = z.infer<
    typeof NewPrincipleLoginMethodSchema
>;

// login method
export const PrincipleLoginMethodSchema = z
    .object({
        isActive: z.boolean(),
        linkedAt: z.string(),
    })
    .extend(NewPrincipleLoginMethodSchema.shape)
    .extend(EntitySchema.shape);
export type IPrincipleLoginMethod = z.infer<typeof PrincipleLoginMethodSchema>;

// login method with relations
export const PrincipleLoginMethodWithRelationsSchema =
    PrincipleLoginMethodSchema.extend({
        principle: z.object(PrincipleWithRelationsSchema.shape).nullable(),
    });
export type IPrincipleLoginMethodWithRelations = z.infer<
    typeof PrincipleLoginMethodWithRelationsSchema
>;
