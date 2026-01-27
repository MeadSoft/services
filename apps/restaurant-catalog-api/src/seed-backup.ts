import z, { ZodSafeParseResult } from 'zod';
import { NestFactory } from '@nestjs/core';
import {
    MENU_ITEMS_TABLE_NAME,
    MENU_ITEMS_TO_SIZES_TABLE_NAME,
    MENU_ITEMS_TO_TAGS_TABLE_NAME,
    MenuItemCommandService,
    MenuItemQueryService,
    MenuItemToSizeCommandService,
    MenuItemToSizeQueryService,
    MenuItemToTagCommandService,
    MenuItemToTagQueryService,
    SIZE_TABLE_NAME,
    SizeCommandService,
    SizeQueryService,
    TAGS_TABLE_NAME,
    TagsCommandService,
    TagsQueryService,
} from '@meadsoft/restaurant-catalog-server-nestjs';
import { RestaurantCatalogModule } from '@meadsoft/restaurant-catalog-server-nestjs';
import {
    MenuItemSchema,
    MenuItemToSizeSchema,
    MenuItemToTagSchema,
    SizeSchema,
    TagSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import * as fs from 'fs';
import * as path from 'path';
import { EMPTY_LENGTH, ICommandService, IQueryService } from '@meadsoft/common';
import {
    BackupSchema,
    IBackup,
    InfrastructureConfigLoader,
    ITableBackup,
} from '@meadsoft/common-infrastructure';

/*

Seeds a database from a backup file that has been created using the
`backup-database.ts` script

!!! Skip to Step 1 !!!

*/

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(
        RestaurantCatalogModule,
    );
    return app;
}

function hasJsonSchema(backup: ITableBackup): boolean {
    return backup.jsonSchema !== undefined;
}

async function seedbackup(
    queryService: IQueryService,
    commandService: ICommandService,
    backup: ITableBackup | undefined,
    schema?: z.ZodType,
) {
    if (backup === undefined) {
        console.error('table backup is undefined. Aborting');
        return;
    }
    const numberOfExistingItems = await queryService.countRows();
    if (numberOfExistingItems > EMPTY_LENGTH) {
        console.log('Seeding skipped: items already exist');
        return;
    }
    const hasJsonSchema_ = hasJsonSchema(backup);
    const hasProvidedSchema = schema !== undefined;
    if (!hasJsonSchema_ && !hasProvidedSchema) {
        console.error(
            `No JSON schema found in the backup data and no Zod schema was provided. Aborting seeding for table ${backup.tableName}`,
        );
        return;
    }
    // TODO: figure out how to convert JSON schemas to zod schemas for validation
    schema ??= z.object({ todo: 1 });
    const parseResults: ZodSafeParseResult<unknown>[] = backup.data.map(
        (item: unknown) => schema.safeParse(item),
    );
    const hasFailedParse = parseResults.some((result) => !result.success);
    if (hasFailedParse) {
        const errors = parseResults
            .filter((result) => !result.success)
            .map((result) => result.error.issues);
        console.error('Failed to parse some items');
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        console.error(JSON.stringify(errors, null, 2));
        throw new Error('Failed to parse some items');
    }
    const items = parseResults
        .filter((result) => result.success)
        .map((result) => result.data);
    console.log(`Seeding ${parseResults.length.toString()} items...`);
    const result = await commandService.seedMany(...items);

    if (result.ok) {
        console.log(`✓ Created: ${parseResults.length.toString()} items`);
    } else {
        console.error(
            `✗ Failed to create ${parseResults.length.toString()} items:`,
            result.val.message,
        );
    }
}

const configLoader = new InfrastructureConfigLoader();
const config = configLoader.loadSync();

if (config.err) {
    throw config.val;
}

// #########################################################################
// Step 1: Set config

console.log(config.val.APP_ENV);
console.log(config.val.DATABASE_URL);

const seedsFolder = 'seeds';
const seedFileName = 'backup-2026-01-17T14.36.29.427Z.json';

// do not touch

const seedDirectory = path.join(__dirname, seedsFolder);
const backupSeedPath: string = path.join(seedDirectory, seedFileName);
if (!fs.existsSync(backupSeedPath)) {
    console.log(`Seed file does not exist: ${backupSeedPath}`);
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const backupUnsafe = JSON.parse(fs.readFileSync(backupSeedPath, 'utf-8'));
const backupSeed: IBackup = BackupSchema.parse(backupUnsafe);

// #########################################################################
// Step 2: Edit the main function to seed desired databased using desired
//         query and command services

async function main() {
    // do not touch
    const app = await bootstrap();

    // #####################################################################
    // Edit the below calls as needed

    // Menu Items
    await seedbackup(
        app.get(MenuItemQueryService),
        app.get(MenuItemCommandService),
        backupSeed.tables.find(
            (table) => table.tableName === MENU_ITEMS_TABLE_NAME,
        ),
        MenuItemSchema,
    );

    // Tags
    await seedbackup(
        app.get(TagsQueryService),
        app.get(TagsCommandService),
        backupSeed.tables.find((table) => table.tableName === TAGS_TABLE_NAME),
        TagSchema,
    );

    // Sizes
    await seedbackup(
        app.get(SizeQueryService),
        app.get(SizeCommandService),
        backupSeed.tables.find((table) => table.tableName === SIZE_TABLE_NAME),
        SizeSchema,
    );

    // Menu Items to Tags
    await seedbackup(
        app.get(MenuItemToTagQueryService),
        app.get(MenuItemToTagCommandService),
        backupSeed.tables.find(
            (table) => table.tableName === MENU_ITEMS_TO_TAGS_TABLE_NAME,
        ),
        MenuItemToTagSchema,
    );

    // Menu Items to Sizes
    await seedbackup(
        app.get(MenuItemToSizeQueryService),
        app.get(MenuItemToSizeCommandService),
        backupSeed.tables.find(
            (table) => table.tableName === MENU_ITEMS_TO_SIZES_TABLE_NAME,
        ),
        MenuItemToSizeSchema,
    );
    await app.close();
}

main().catch((error: unknown) => {
    console.error('✗ Seeding failed:', error);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    process.exit(1);
});
