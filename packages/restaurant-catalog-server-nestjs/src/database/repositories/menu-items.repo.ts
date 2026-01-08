import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import {
    IMenuItem,
    MenuItemSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import { menuItemsTable } from '../tables/menu-items.table';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class MenuItemRepository extends DrizzlePgCommandRepository<IMenuItem> {
    constructor(unitOfWork: PostgresUnitOfWork) {
        super(menuItemsTable, new ZodSchema(MenuItemSchema), unitOfWork);
    }

    override equals(id: string) {
        return eq(menuItemsTable.id, id);
    }
}
