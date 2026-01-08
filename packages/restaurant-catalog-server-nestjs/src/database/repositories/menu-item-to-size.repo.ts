import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';
import {
    IMenuItemToSize,
    MenuItemToSizeSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import { menuItemToSizeTable } from '../tables/menu-item-to-size.table';

@Injectable()
export class MenuItemToSizeRepository extends DrizzlePgCommandRepository<IMenuItemToSize> {
    constructor(protected override unitOfWork: PostgresUnitOfWork) {
        super(
            menuItemToSizeTable,
            new ZodSchema(MenuItemToSizeSchema),
            unitOfWork,
        );
    }

    override equals(id: string) {
        return eq(menuItemToSizeTable.id, id);
    }
}
