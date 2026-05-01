import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import {
    IBackupConfig,
    backupRepositories,
    InfrastructureConfig,
} from '@meadsoft/common-infrastructure';
import {
    MenuItemRepository,
    SizesRepository,
    TagsRepository,
    MenuItemToTagRepository,
    MenuItemToSizeRepository,
    RestaurantCatalogModule,
    MENU_ITEMS_TO_SIZES_TABLE_NAME,
    TAGS_TABLE_NAME,
    SIZE_TABLE_NAME,
    MENU_ITEMS_TABLE_NAME,
    MENU_ITEMS_TO_TAGS_TABLE_NAME,
} from '@meadsoft/restaurant-catalog-http-server-nestjs';
import { ERROR_EXIT_CODE, SUCCESS_EXIT_CODE } from '@meadsoft/common';

async function main() {
    const app = await NestFactory.create(RestaurantCatalogModule);
    const config = app.get(InfrastructureConfig);
    const repositories: IBackupConfig[] = [
        {
            tableName: MENU_ITEMS_TABLE_NAME,
            repository: app.get(MenuItemRepository),
        },
        { tableName: SIZE_TABLE_NAME, repository: app.get(SizesRepository) },
        { tableName: TAGS_TABLE_NAME, repository: app.get(TagsRepository) },
        {
            tableName: MENU_ITEMS_TO_TAGS_TABLE_NAME,
            repository: app.get(MenuItemToTagRepository),
        },
        {
            tableName: MENU_ITEMS_TO_SIZES_TABLE_NAME,
            repository: app.get(MenuItemToSizeRepository),
        },
    ];
    await backupRepositories(
        config,
        repositories,
        join(__dirname, '..', 'backups'),
    );
    await app.close();
    process.exit(SUCCESS_EXIT_CODE);
}

// Run the backup
main().catch((error: unknown) => {
    console.error('Backup failed:', error);
    process.exit(ERROR_EXIT_CODE);
});
