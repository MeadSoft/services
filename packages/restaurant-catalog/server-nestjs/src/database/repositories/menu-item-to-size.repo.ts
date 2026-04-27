import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { ZodSchema } from '@meadsoft/common-server';
import { eq } from 'drizzle-orm';
import {
    IMenuItemToSize,
    MenuItemToSizeSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import { menuItemToSizeTable } from '../tables/menu-item-to-size.table';

@Injectable()
export class MenuItemToSizeRepository extends DrizzlePgCommandRepository<IMenuItemToSize> {
    constructor(
        protected override unitOfWork: PostgresUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            menuItemToSizeTable,
            new ZodSchema(MenuItemToSizeSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(menuItemToSizeTable.id, id);
    }
}
