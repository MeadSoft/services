import { z } from 'zod';

export const UserAccountSchema = z.object({
    id: z.uuid(),
    email: z.string().nullable(),
    displayName: z.string().nullable(),
    firebaseUid: z.string().nullable(),
    iamRoles: z.array(z.string()),
    isActive: z.boolean(),
    createdDate: z.string().nullable(),
    updatedDate: z.string().nullable(),
    createdById: z.string().nullable(),
    updatedById: z.string().nullable(),
});

export type IUserAccount = z.infer<typeof UserAccountSchema>;

export const UserLoginMethodSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    /** 'local' = Firebase email/password  |  'google' = Google OAuth via Firebase */
    provider: z.enum(['local', 'google']),
    providerUserId: z.string().nullable(),
    providerEmail: z.string().nullable(),
    isActive: z.boolean(),
    linkedAt: z.string(),
});

export type IUserLoginMethod = z.infer<typeof UserLoginMethodSchema>;

export const MIN_PASSWORD_LENGTH = 8;

export const LocalLoginRequestSchema = z.object({
    email: z.email(),
    password: z.string().nonempty(),
});

export type ILocalLoginRequest = z.infer<typeof LocalLoginRequestSchema>;

export const LocalRegisterRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    displayName: z.string().optional(),
});

export type ILocalRegisterRequest = z.infer<typeof LocalRegisterRequestSchema>;
