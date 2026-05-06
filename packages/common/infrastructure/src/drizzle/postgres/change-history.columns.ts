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
export const createdById = uuid('createdById');
export const updatedById = uuid('updatedById');

export const changeHistoryColumns = {
    createdDate,
    updatedDate,
    createdById,
    updatedById,
};
