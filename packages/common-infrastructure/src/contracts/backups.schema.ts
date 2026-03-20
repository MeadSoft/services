import { Environment } from '@meadsoft/common-server';
import { z } from 'zod';

export const TableBackupSchema = z.object({
    tableName: z.string().nonempty().nonoptional(),
    data: z.array(z.unknown()),
    jsonSchema: z.string().optional(),
});
export type ITableBackup = z.infer<typeof TableBackupSchema>;

export const BackupSchema = z.object({
    timestamp: z.iso.datetime(),
    appEnv: z.enum(Object.values(Environment)),
    totalRecords: z.int(),
    tables: z.array(TableBackupSchema),
});
export type IBackup = z.infer<typeof BackupSchema>;
