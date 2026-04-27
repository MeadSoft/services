import z from 'zod';
import { MIN_PASSWORD_LENGTH } from '../constants';

export const LocalLoginRequestSchema = z.object({
    email: z.email(),
    password: z.string().nonempty(),
});
export const LocalRegisterRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    displayName: z.string().optional(),
});
export type ILocalLoginRequest = z.infer<typeof LocalLoginRequestSchema>;
export type ILocalRegisterRequest = z.infer<typeof LocalRegisterRequestSchema>;
