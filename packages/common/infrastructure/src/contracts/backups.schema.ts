import { Environment } from '@meadsoft/common';
import z from 'zod';

export const SeedDataSchema = z.object({
    tableName: z.string().nonempty().nonoptional(),
    data: z.array(z.unknown()),
    jsonSchema: z.string().optional(),
});
export type ISeedData = z.infer<typeof SeedDataSchema>;

export const SeedSchema = z.object({
    timestamp: z.iso.datetime(),
    appEnv: z.enum(Object.values(Environment)),
    totalRecords: z.int(),
    tables: z.array(SeedDataSchema),
});
export type ISeed = z.infer<typeof SeedSchema>;
