import { z } from 'zod';

export const ChangeHistorySchema = z.object({
    createdDate: z.iso.datetime().nullable(),
    updatedDate: z.iso.datetime().nullable(),
    createdById: z.string().nullable(),
    updatedById: z.string().nullable(),
});

export type IChangeHistory = z.infer<typeof ChangeHistorySchema>;
export type IUpdateHistory = Pick<
    IChangeHistory,
    'updatedById' | 'updatedDate'
>;
