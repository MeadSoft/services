import { pgSchema } from 'drizzle-orm/pg-core';

export const RESTAURANT_CATALOG_DB_SCHEMA_NAME = 'restaurant-catalog';

export const restaurantCatalogSchema = pgSchema(
    RESTAURANT_CATALOG_DB_SCHEMA_NAME,
);
