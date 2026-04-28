import { uuid } from 'drizzle-orm/pg-core';
import { isoTimestamp } from './iso-timestamp.column';

export const createdDate = isoTimestamp('createdDate', {
    mode: 'string',
    withTimezone: true,
});
export const updatedDate = isoTimestamp('updatedDate', {
    mode: 'string',
    withTimezone: true,
});
export const createdById = uuid();
export const updatedById = uuid();

export const changeHistoryColumns = {
    createdDate,
    updatedDate,
    createdById,
    updatedById,
};
