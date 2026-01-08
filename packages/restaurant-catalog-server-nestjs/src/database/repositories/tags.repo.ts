import { Injectable } from '@nestjs/common';
import { Tag, TagSchema } from '@meadsoft/restaurant-catalog-contracts';
import {
    DrizzlePgCommandRepository,
    PostgresUnitOfWork,
} from '@meadsoft/common-infrastructure';
import { tagsTable } from '../tables/tags.table';
import { ZodSchema } from '@meadsoft/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class TagsRepository extends DrizzlePgCommandRepository<Tag> {
    constructor(protected override unitOfWork: PostgresUnitOfWork) {
        super(tagsTable, new ZodSchema(TagSchema), unitOfWork);
    }

    override equals(id: string) {
        return eq(tagsTable.id, id);
    }
}
