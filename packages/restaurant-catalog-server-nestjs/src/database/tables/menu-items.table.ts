import { varchar, text, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { entityColumns } from '@meadsoft/common-infrastructure';
import {
    MENU_ITEM_IS_ACTIVE_DEFAULT,
    MENU_ITEM_IS_FAVORITE_DEFAULT,
} from '@meadsoft/restaurant-catalog-contracts';
import { menuItemToTagTable } from './menu-item-to-tag.table';
import { restaurantCatalogSchema } from './restaurant-catalog.db-schema';

export const MENU_ITEMS_TABLE_NAME = 'menu_items';

export const menuItemsTable = restaurantCatalogSchema.table(
    MENU_ITEMS_TABLE_NAME,
    {
        ...entityColumns,
        name: varchar({ length: 255 }).notNull(),
        description: text(),
        imageUrl: varchar({ length: 512 }),
        price: decimal<'number'>({ precision: 10, scale: 2, mode: 'number' }),
        isFavorite: boolean().default(MENU_ITEM_IS_FAVORITE_DEFAULT).notNull(),
        isActive: boolean().default(MENU_ITEM_IS_ACTIVE_DEFAULT).notNull(),
    },
);

export const menuItemsRelations = relations(menuItemsTable, ({ many }) => ({
    menuItemsToTags: many(menuItemToTagTable),
    sizes: many(menuItemToTagTable),
}));
