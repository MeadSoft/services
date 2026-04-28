import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import {
    IMenuItem,
    IMenuItemWithRelations,
    MenuItemSchema,
    MenuItemWithRelationsSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import { menuItemsTable } from '../tables/menu-items.table';
import { FIRST_INDEX, IFilter, ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';
import { RestaurantCatalogUnitOfWork } from './restaurant-catalog-database.service';
import type { RestaurantCatalogDrizzleSchema } from '../tables/drizzle-schema';

@Injectable()
export class MenuItemRepository extends DrizzlePgCommandRepository<
    IMenuItem,
    string,
    RestaurantCatalogDrizzleSchema
> {
    menuItemWithRelationsSchema = new ZodSchema(MenuItemWithRelationsSchema);

    constructor(
        unitOfWork: RestaurantCatalogUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            menuItemsTable,
            new ZodSchema(MenuItemSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(menuItemsTable.id, id);
    }

    async findOneWithRelations(
        id: string,
    ): Promise<IMenuItemWithRelations | null> {
        const filter: IFilter = {
            table: 'menuItems',
            field: 'id',
            operator: 'eq',
            value: id,
        };
        const results = await this.findManyWithRelations(filter);
        return results[FIRST_INDEX];
    }

    async findManyWithRelations(
        ...filters: IFilter[]
    ): Promise<IMenuItemWithRelations[]> {
        const sqlFilters = this.filterTranslationService.translate(...filters);
        const database = this.unitOfWork.getDatabase();

        let items = await database.query.menuItemsTable.findMany({
            where: sqlFilters,
            with: {
                menuItemsToTags: {
                    with: {
                        tags: true,
                    },
                },
                menuItemsToSizes: {
                    with: {
                        sizes: true,
                    },
                },
            },
        });
        items = items.map((item) => {
            return {
                ...item,
                tags: item.menuItemsToTags.map((mit) => mit.tags),
                sizes: item.menuItemsToSizes.map((mis) => mis.sizes),
            };
        });

        const results: IMenuItemWithRelations[] = [];
        for (const item of items) {
            const result = this.menuItemWithRelationsSchema.parse(item);
            if (result.err) {
                throw result.val;
            }
            results.push({
                ...result.val,
            });
        }
        return results;
    }
}
