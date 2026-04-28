import { type PgTimestampConfig } from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';

export function isoTimestamp(name: string, config?: PgTimestampConfig) {
    return customType({
        dataType() {
            const precision =
                typeof config?.precision !== 'undefined'
                    ? ` (${config.precision.toString()})`
                    : '';
            return `timestamp${precision}${
                config?.withTimezone === undefined ? ' with time zone' : ''
            }`;
        },
        fromDriver(value: unknown) {
            if (value instanceof Date) {
                return value.toISOString();
            }
            if (typeof value === 'string') {
                return new Date(value).toISOString();
            }
            throw new Error(`Cannot convert value to ISO timestamp string`);
        },
        toDriver(value: unknown): Date {
            if (typeof value === 'string') {
                return new Date(value);
            }
            throw new Error(`Cannot convert value to JS date`);
        },
    })(name);
}
