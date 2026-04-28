import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
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
    constructor(
        protected override unitOfWork: PostgresUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            menuItemToTagTable,
            new ZodSchema(MenuItemToTagSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(menuItemToTagTable.id, id);
    }
}
