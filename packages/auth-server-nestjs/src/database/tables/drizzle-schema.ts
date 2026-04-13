import { relations } from 'drizzle-orm';
import { usersTable } from './users.table';
import { userLoginMethodsTable } from './user-login-methods.table';

export const usersRelations = relations(usersTable, ({ many }) => ({
    loginMethods: many(userLoginMethodsTable),
}));

export const userLoginMethodsRelations = relations(
    userLoginMethodsTable,
    ({ one }) => ({
        user: one(usersTable, {
            fields: [userLoginMethodsTable.userId],
            references: [usersTable.id],
        }),
    }),
);

export const authDrizzleSchema = {
    usersTable,
    userLoginMethodsTable,
    usersRelations,
    userLoginMethodsRelations,
};

export type AuthDrizzleSchema = typeof authDrizzleSchema;
