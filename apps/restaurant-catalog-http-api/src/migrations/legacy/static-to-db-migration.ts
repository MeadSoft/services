import { NestFactory } from '@nestjs/core';
import {
    MenuItemRepository,
    MenuItemToSizeCommandService,
    MenuItemToTagCommandService,
    RestaurantCatalogModule,
    SizesRepository,
    TagsRepository,
} from '@meadsoft/restaurant-catalog-http-server-nestjs';
import {
    ICrudRepository,
    InfrastructureConfigLoader,
} from '@meadsoft/common-infrastructure';
import { MENU_ITEMS as legacyMenuItems } from './menu-items';
import { EMPTY_LENGTH, SYSTEM_UUID } from '@meadsoft/common';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(
        RestaurantCatalogModule,
    );
    return app;
}

async function staticToDbDataMigration() {
    // ##################################################################
    // initialization
    const configLoader = new InfrastructureConfigLoader();
    const configResult = configLoader.loadSync();
    if (configResult.err) {
        console.error('Failed to load configuration:', configResult.val);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        process.exit(1);
    }
    const app = await bootstrap();

    const menuItemRepo = app.get(MenuItemRepository);
    const sizesRepo = app.get(SizesRepository);
    const tagsRepo = app.get(TagsRepository);
    const menuItemToTagCommandService = app.get(MenuItemToTagCommandService);
    const menuItemToSizeCommandService = app.get(MenuItemToSizeCommandService);

    const repositories: Record<
        string,
        {
            dbItems: unknown[];
            repo: ICrudRepository;
            nameToId: Record<string, string | undefined>;
        }
    > = {
        menu_items: { dbItems: [], repo: menuItemRepo, nameToId: {} },
        sizes: { dbItems: [], repo: sizesRepo, nameToId: {} },
        tags: { dbItems: [], repo: tagsRepo, nameToId: {} },
    };

    // ##################################################################
    // fetch existing items from the database

    for (const [name, { repo }] of Object.entries(repositories)) {
        const items = await repo.findMany();
        repositories[name].dbItems = items;
        for (const item of items) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const itemName = (item as any).name as string;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const itemId = (item as any).id as string;
            repositories[name].nameToId[itemName] = itemId;
        }
    }

    // ##################################################################
    // create missing many to many relationships

    const missingMenuItemToTagRelationships: Array<{
        menuItemId: string;
        tagId: string;
    }> = [];
    const missingMenuItemToSizeRelationships: Array<{
        menuItemId: string;
        sizeId: string;
    }> = [];
    const missedLegacyMenuItems: string[] = [];
    const missedLegacyTags: string[] = [];
    const missedSizes: string[] = [];
    for (const legacyMenuItem of legacyMenuItems) {
        // insert menu item to tag relationship
        console.log(`Creating tag relationships for ${legacyMenuItem.name}`);
        const existingMenuItem =
            repositories['menu_items'].nameToId[legacyMenuItem.name];
        if (existingMenuItem === undefined) {
            missedLegacyMenuItems.push(legacyMenuItem.name);
            continue;
        }
        for (const tag of legacyMenuItem.categories ?? []) {
            const existingTag = repositories['tags'].nameToId[tag];
            if (existingTag === undefined) {
                missedLegacyTags.push(tag);
                continue;
            }
            missingMenuItemToTagRelationships.push({
                menuItemId: existingMenuItem,
                tagId: existingTag,
            });
        }
        if (legacyMenuItem.size === undefined) {
            continue;
        }
        console.log(`Creating size relationships for ${legacyMenuItem.name}`);
        const existingSize =
            repositories['sizes'].nameToId[
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                legacyMenuItem.size
            ];
        if (existingSize === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            missedSizes.push(legacyMenuItem.size);
            continue;
        }
        missingMenuItemToSizeRelationships.push({
            menuItemId: existingMenuItem,
            sizeId: existingSize,
        });
    }

    // ##################################################################
    // insert missing relationships into the database

    await menuItemToTagCommandService.createMany(
        SYSTEM_UUID,
        ...missingMenuItemToTagRelationships,
    );
    await menuItemToSizeCommandService.createMany(
        SYSTEM_UUID,
        ...missingMenuItemToSizeRelationships,
    );

    if (missedLegacyMenuItems.length > EMPTY_LENGTH) {
        console.warn(
            `Missed legacy menu items: ${[
                ...new Set(missedLegacyMenuItems),
            ].join(', ')}`,
        );
    }
    if (missedLegacyTags.length > EMPTY_LENGTH) {
        console.warn(
            `Missed legacy tags: ${[...new Set(missedLegacyTags)].join(', ')}`,
        );
    }
    if (missedSizes.length > EMPTY_LENGTH) {
        console.warn(`Missed sizes: ${[...new Set(missedSizes)].join(', ')}`);
    }

    // ##################################################################
    // finishing up

    await app.close();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    process.exit(0);
}

staticToDbDataMigration().catch((error: unknown) => {
    console.error('Backup failed:', error);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    process.exit(1);
});
