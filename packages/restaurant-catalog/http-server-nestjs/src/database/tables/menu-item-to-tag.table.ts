import { relations } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';
import { changeHistoryColumns } from '@meadsoft/common-infrastructure';
import { menuItemsTable } from './menu-items.table';
import { tagsTable } from './tags.table';
import { restaurantCatalogSchema } from './restaurant-catalog.db-schema';

export const MENU_ITEMS_TO_TAGS_TABLE_NAME = 'menu_items_to_tags';

export const menuItemToTagTable = restaurantCatalogSchema.table(
    MENU_ITEMS_TO_TAGS_TABLE_NAME,
    {
        id: uuid().primaryKey(),
        menuItemId: uuid()
            .references(() => menuItemsTable.id)
            .notNull(),
        tagId: uuid()
            .references(() => tagsTable.id)
            .notNull(),
        ...changeHistoryColumns,
    },
);

export const menuItemsToTagsRelations = relations(
    menuItemToTagTable,
    ({ one }) => ({
        menuItems: one(menuItemsTable, {
            fields: [menuItemToTagTable.menuItemId],
            references: [menuItemsTable.id],
        }),
        tags: one(tagsTable, {
            fields: [menuItemToTagTable.tagId],
            references: [tagsTable.id],
        }),
    }),
);
