import { Injectable } from '@nestjs/common';
import { ITag, TagSchema } from '@meadsoft/restaurant-catalog-contracts';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { tagsTable } from '../tables/tags.table';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class TagsRepository extends DrizzlePgCommandRepository<ITag> {
    constructor(
        protected override unitOfWork: PostgresUnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            tagsTable,
            new ZodSchema(TagSchema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq(tagsTable.id, id);
    }
}
