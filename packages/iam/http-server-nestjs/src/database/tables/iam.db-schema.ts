import { pgSchema } from 'drizzle-orm/pg-core';

export const IAM_DB_SCHEMA_NAME = 'iam';
export const iamSchema = pgSchema(IAM_DB_SCHEMA_NAME);
