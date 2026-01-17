import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DummyCrudRepository,
    PostgresUnitOfWork,
    InMemoryCommandRepository,
} from '@meadsoft/common-infrastructure';
import type {
    IFilterTranslationService,
    InMemoryUnitOfWork,
} from '@meadsoft/common-infrastructure';
import {
    IMenuItem,
    MenuItemSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import { menuItemsTable } from '../tables/menu-items.table';
import { ZodSchema } from '@meadsoft/common';
import { eq, SQL } from 'drizzle-orm';

@Injectable()
export class MenuItemRepository extends DummyCrudRepository {}

@Injectable()
export class MenuItemDrizzlePgRepository extends DrizzlePgCommandRepository<IMenuItem> {
    constructor(
        unitOfWork: PostgresUnitOfWork,
        filterTranslationService: IFilterTranslationService<SQL>,
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
}

@Injectable()
export class MenuItemInMemoryRepository extends InMemoryCommandRepository<IMenuItem> {
    constructor(unitOfWork: InMemoryUnitOfWork) {
        super('menu-items', new ZodSchema(MenuItemSchema), unitOfWork);
    }

    override equals(id: string) {
        return eq(menuItemsTable.id, id);
    }
}
