import { relations } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';
import { menuItemsTable } from './menu-items.table';
import { sizesTable } from './sizes.table';
import { changeHistoryColumns } from '@meadsoft/common-infrastructure';
import { restaurantCatalogSchema } from './restaurant-catalog.db-schema';

export const MENU_ITEMS_TO_SIZES_TABLE_NAME = 'menu_items_to_sizes';

export const menuItemToSizeTable = restaurantCatalogSchema.table(
    MENU_ITEMS_TO_SIZES_TABLE_NAME,
    {
        id: uuid().primaryKey(),
        menuItemId: uuid()
            .references(() => menuItemsTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            })
            .notNull(),
        sizeId: uuid()
            .references(() => sizesTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            })
            .notNull(),
        ...changeHistoryColumns,
    },
);

export const menuItemToSizeRelations = relations(
    menuItemToSizeTable,
    ({ one }) => ({
        menuItems: one(menuItemsTable, {
            fields: [menuItemToSizeTable.menuItemId],
            references: [menuItemsTable.id],
        }),
        sizes: one(sizesTable, {
            fields: [menuItemToSizeTable.sizeId],
            references: [sizesTable.id],
        }),
    }),
);
