import { menuItemsTable, menuItemsRelations } from './menu-items.table';
import { sizesRelations, sizesTable } from './sizes.table';
import { tagsRelations, tagsTable } from './tags.table';
import {
    menuItemToSizeRelations,
    menuItemToSizeTable,
} from './menu-item-to-size.table';
import {
    menuItemsToTagsRelations,
    menuItemToTagTable,
} from './menu-item-to-tag.table';

export const restaurantCatalogDrizzleSchema = {
    menuItemsTable,
    sizesTable,
    tagsTable,
    menuItemToSizeTable,
    menuItemToTagTable,
    menuItemsRelations,
    sizesRelations,
    tagsRelations,
    menuItemToSizeRelations,
    menuItemsToTagsRelations,
};

export type RestaurantCatalogDrizzleSchema =
    typeof restaurantCatalogDrizzleSchema;
