import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    email: z.email().optional(),
    roles: z.array(z.string()),
});

export type User = z.infer<typeof UserSchema>;
