import { varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { menuItemToSizeTable } from './menu-item-to-size.table';
import { restaurantCatalogSchema } from './restaurant-catalog.db-schema';

export const SIZE_TABLE_NAME = 'sizes';

export const sizesTable = restaurantCatalogSchema.table(SIZE_TABLE_NAME, {
    ...entityColumns,
    name: varchar({ length: 255 }).notNull(),
});

export const sizesRelations = relations(sizesTable, ({ many }) => ({
    menuItemsToSizes: many(menuItemToSizeTable),
}));
