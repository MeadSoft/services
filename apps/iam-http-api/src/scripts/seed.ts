import { NestFactory } from '@nestjs/core';
import {
    MENU_ITEMS_TABLE_NAME,
    MENU_ITEMS_TO_SIZES_TABLE_NAME,
    MENU_ITEMS_TO_TAGS_TABLE_NAME,
    SIZE_TABLE_NAME,
    TAGS_TABLE_NAME,
    MenuItemCommandService,
    MenuItemToSizeCommandService,
    MenuItemToTagCommandService,
    SizeCommandService,
    TagsCommandService,
    RestaurantCatalogModule,
} from '@meadsoft/restaurant-catalog-http-server-nestjs';
import {
    MenuItemSchema,
    MenuItemToSizeSchema,
    MenuItemToTagSchema,
    SizeSchema,
    TagSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import { ISeedConfig, seedFromFile } from '@meadsoft/common-infrastructure';
import { ERROR_EXIT_CODE } from '@meadsoft/common';

const seedFileName = `seeds/backup-2026-01-17T14.36.29.427Z.json`;

async function main() {
    const app = await NestFactory.createApplicationContext(
        RestaurantCatalogModule,
    );

    const menuItemSeedConfig: ISeedConfig = {
        tableName: MENU_ITEMS_TABLE_NAME,
        crudService: app.get(MenuItemCommandService),
        schema: MenuItemSchema,
    };
    const tagsSeedConfig: ISeedConfig = {
        tableName: TAGS_TABLE_NAME,
        crudService: app.get(TagsCommandService),
        schema: TagSchema,
    };
    const sizesSeedConfig: ISeedConfig = {
        tableName: SIZE_TABLE_NAME,
        crudService: app.get(SizeCommandService),
        schema: SizeSchema,
    };
    const menuItemsToTagsSeedConfig: ISeedConfig = {
        tableName: MENU_ITEMS_TO_TAGS_TABLE_NAME,
        crudService: app.get(MenuItemToTagCommandService),
        schema: MenuItemToTagSchema,
    };
    const menuItemsToSizesSeedConfig: ISeedConfig = {
        tableName: MENU_ITEMS_TO_SIZES_TABLE_NAME,
        crudService: app.get(MenuItemToSizeCommandService),
        schema: MenuItemToSizeSchema,
    };

    await seedFromFile([menuItemSeedConfig], seedFileName);
    await seedFromFile([tagsSeedConfig], seedFileName);
    await seedFromFile([sizesSeedConfig], seedFileName);
    await seedFromFile([menuItemsToTagsSeedConfig], seedFileName);
    await seedFromFile([menuItemsToSizesSeedConfig], seedFileName);
    await app.close();
}

main().catch((error: unknown) => {
    console.error('✗ Seeding failed:', error);
    process.exit(ERROR_EXIT_CODE);
});
