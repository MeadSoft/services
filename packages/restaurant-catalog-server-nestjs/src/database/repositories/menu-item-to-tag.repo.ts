import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';
import { menuItemToTagTable } from '../tables/menu-item-to-tag.table';
import {
    IMenuItemToTag,
    MenuItemToTagSchema,
} from '@meadsoft/restaurant-catalog-contracts';

@Injectable()
export class MenuItemToTagRepository extends DrizzlePgCommandRepository<IMenuItemToTag> {
    constructor(protected override unitOfWork: PostgresUnitOfWork) {
        super(
            menuItemToTagTable,
            new ZodSchema(MenuItemToTagSchema),
            unitOfWork,
        );
    }

    override equals(id: string) {
        return eq(menuItemToTagTable.id, id);
    }
}
