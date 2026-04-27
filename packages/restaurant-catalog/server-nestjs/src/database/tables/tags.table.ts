import { varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { menuItemToTagTable } from './menu-item-to-tag.table';
import { restaurantCatalogSchema } from './restaurant-catalog.db-schema';

export const TAGS_TABLE_NAME = 'tags';

export const tagsTable = restaurantCatalogSchema.table(TAGS_TABLE_NAME, {
    ...entityColumns,
    name: varchar({ length: 255 }).notNull(),
});

export const tagsRelations = relations(tagsTable, ({ many }) => ({
    menuItemsToTags: many(menuItemToTagTable),
}));
