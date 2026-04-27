import zod from 'zod';
import type { CookieOptions } from 'express';

export const CookieIamConfigJsonSchema = zod.object({
    domain: zod.string().optional(),
    secure: zod.boolean(),
    sameSite: zod.enum(['lax', 'strict', 'none']),
    maxAge: zod.number().int().positive(),
}) satisfies zod.ZodType<CookieOptions>;
