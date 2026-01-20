import { NestFactory } from '@nestjs/core';
import {
    IBackup,
    InfrastructureConfigLoader,
    ITableBackup,
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
} from '@meadsoft/restaurant-catalog-server-nestjs';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { Environment } from '@meadsoft/common';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(
        RestaurantCatalogModule,
    );
    return app;
}

async function backupDatabase() {
    const configLoader = new InfrastructureConfigLoader();
    const configResult = configLoader.loadSync();
    if (configResult.err) {
        console.error('Failed to load configuration:', configResult.val);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        process.exit(1);
    }
    const config = configResult.val;
    const app = await bootstrap();

    // Define all repositories to backup
    const menuItemRepo = app.get(MenuItemRepository);
    const sizesRepo = app.get(SizesRepository);
    const tagsRepo = app.get(TagsRepository);
    const menuItemToTagRepo = app.get(MenuItemToTagRepository);
    const menuItemToSizeRepo = app.get(MenuItemToSizeRepository);

    const repositories = [
        { name: MENU_ITEMS_TABLE_NAME, repo: menuItemRepo },
        { name: SIZE_TABLE_NAME, repo: sizesRepo },
        { name: TAGS_TABLE_NAME, repo: tagsRepo },
        { name: MENU_ITEMS_TO_TAGS_TABLE_NAME, repo: menuItemToTagRepo },
        { name: MENU_ITEMS_TO_SIZES_TABLE_NAME, repo: menuItemToSizeRepo },
    ];
    //

    const backups: ITableBackup[] = [];
    let totalRecords = 0;

    console.log('\nStarting backup...\n');

    // Backup each table using repository's findMany()
    for (const { name, repo } of repositories) {
        console.log(`Backing up ${name}...`);
        const data = await repo.findMany();
        backups.push({ tableName: name, data });
        console.log(`✓ ${name}: ${data.length.toString()} records`);
        totalRecords += data.length;
    }
    const backupsDir = join(__dirname, '..', 'backups');
    await mkdir(backupsDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '.');
    const filename = `backup-${timestamp}.json`;
    const filepath = join(backupsDir, filename);
    if (!(config.APP_ENV in Environment)) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const appEnv: Environment = config.APP_ENV as Environment;
    const backupData: IBackup = {
        timestamp: new Date().toISOString(),
        appEnv: appEnv,
        totalRecords,
        tables: backups,
    };
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    await writeFile(filepath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`\n✓ Backup completed successfully!`);
    console.log(`  Total records: ${totalRecords.toString()}`);
    console.log(`  File: ${filepath}`);
    await app.close();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    process.exit(0);
}

// Run the backup
backupDatabase().catch((error: unknown) => {
    console.error('Backup failed:', error);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    process.exit(1);
});
