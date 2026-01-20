import { ChangeHistorySchema, IChangeHistory } from './change-history.schema';
import { z } from 'zod';

export const EntitySchema = ChangeHistorySchema.extend({
    id: z.string(),
});

export interface IEntity<Tid = string> extends IChangeHistory {
    id: Tid;
}

export class Entity<Tid = string> implements IEntity<Tid> {
    id!: Tid;
    createdDate!: string | null;
    updatedDate!: string | null;
    createdById!: string | null;
    updatedById!: string | null;
}
