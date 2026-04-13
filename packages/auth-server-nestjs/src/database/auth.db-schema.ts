import { pgSchema } from 'drizzle-orm/pg-core';

export const AUTH_DB_SCHEMA_NAME = 'auth';
export const authSchema = pgSchema(AUTH_DB_SCHEMA_NAME);
