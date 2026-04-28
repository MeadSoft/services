import { uuid } from 'drizzle-orm/pg-core';
import { changeHistoryColumns } from './change-history.columns';

export const id = () => uuid().notNull().primaryKey();

export const entityColumns = {
    id: id(),
    ...changeHistoryColumns,
};
