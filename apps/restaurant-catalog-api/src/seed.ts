import { NestFactory } from '@nestjs/core';
import {
    MenuItemCommandService,
    MenuItemQueryService,
    MenuItemToTagCommandService,
    MenuItemToTagQueryService,
    SizeCommandService,
    SizeQueryService,
    TagsCommandService,
    TagsQueryService,
} from '@meadsoft/restaurant-catalog-server-nestjs';
import { RestaurantCatalogModule } from '@meadsoft/restaurant-catalog-server-nestjs';
import {
    NewMenuItemSchema,
    NewMenuItemToTagSchema,
    NewSizeSchema,
    NewTagSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import * as fs from 'fs';
import * as path from 'path';
import {
    EMPTY_LENGTH,
    ICommandService,
    IQueryService,
    SYSTEM_UUID,
} from '@meadsoft/common';
import { ZodSafeParseResult, ZodType } from 'zod';
import { InfrastructureConfigLoader } from '@meadsoft/common-infrastructure';

const configLoader = new InfrastructureConfigLoader();
const config = configLoader.loadSync();

if (config.err) {
    throw config.val;
}

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(
        RestaurantCatalogModule,
    );
    return app;
}

async function seed(
    queryService: IQueryService,
    commandService: ICommandService,
    schema: ZodType,
    jsonPath: string,
) {
    const numberOfExistingItems = await queryService.countRows();
    if (numberOfExistingItems > EMPTY_LENGTH) {
        console.log('Seeding skipped: items already exist');
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rawItems: object[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const parseResults: ZodSafeParseResult<unknown>[] = rawItems.map(
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
    const newItems = parseResults
        .filter((result) => result.success)
        .map((result) => result.data);
    console.log(`Seeding ${parseResults.length.toString()} items...`);
    const result = await commandService.createMany(SYSTEM_UUID, ...newItems);

    if (result.ok) {
        console.log(`✓ Created: ${parseResults.length.toString()} items`);
    } else {
        console.error(
            `✗ Failed to create ${parseResults.length.toString()} items:`,
            result.val.message,
        );
    }
}

async function main() {
    const app = await bootstrap();
    // Menu Items
    const menuItemsCommandService = app.get(MenuItemCommandService);
    const menuItemsQueryService = app.get(MenuItemQueryService);
    await seed(
        menuItemsQueryService,
        menuItemsCommandService,
        NewMenuItemSchema,
        path.join(__dirname, 'seeds', 'haru-cafe-menu-items.json'),
    );
    // Tags
    const tagsCommandService = app.get(TagsCommandService);
    const tagsQueryService = app.get(TagsQueryService);
    await seed(
        tagsQueryService,
        tagsCommandService,
        NewTagSchema,
        path.join(__dirname, 'seeds', 'haru-cafe-tags.json'),
    );
    // Sizes
    const sizeCommandService = app.get(SizeCommandService);
    const sizeQueryService = app.get(SizeQueryService);
    await seed(
        sizeQueryService,
        sizeCommandService,
        NewSizeSchema,
        path.join(__dirname, 'seeds', 'haru-cafe-sizes.json'),
    );
    // Menu Items to Tags
    const menuItemsToTagsCommandService = app.get(MenuItemToTagCommandService);
    const menuItemsToTagsQueryService = app.get(MenuItemToTagQueryService);
    await seed(
        menuItemsToTagsQueryService,
        menuItemsToTagsCommandService,
        NewMenuItemToTagSchema,
        path.join(__dirname, 'seeds', 'haru-cafe-menu-items-to-tags.json'),
    );
    await app.close();
}

main().catch((error: unknown) => {
    console.error('✗ Seeding failed:', error);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    process.exit(1);
});
