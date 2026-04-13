import { boolean, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { changeHistoryColumns } from '@meadsoft/common-infrastructure';
import { authSchema } from '../auth.db-schema';

export const USERS_TABLE_NAME = 'users';

/**
 * Stores every authenticated identity that has logged in to the application.
 * Firebase UID is kept for Google Cloud IAM role resolution via Firebase custom claims.
 * iamRoles is a cached snapshot of the GCP IAM roles propagated through Firebase custom claims.
 */
export const usersTable = authSchema.table(USERS_TABLE_NAME, {
    id: uuid().notNull().primaryKey(),
    email: varchar({ length: 255 }).unique(),
    displayName: varchar({ length: 255 }),
    /** Firebase UID — used as the stable external identity key for IAM lookups */
    firebaseUid: varchar({ length: 128 }).unique(),
    /** Google Cloud IAM roles synced from Firebase custom claims on each login */
    iamRoles: text().array().notNull(),
    /** bcrypt/scrypt hash — only set for users who registered with email + password */
    passwordHash: varchar({ length: 255 }),
    isActive: boolean().default(true).notNull(),
    ...changeHistoryColumns,
});
