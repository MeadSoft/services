import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { INewTag, ITag } from '@meadsoft/restaurant-catalog-contracts';
import { TagsRepository } from '../database/repositories';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { TagEntity } from '../domain/tag.entity';

@Injectable()
export class TagsQueryService extends QueryService<ITag> {
    constructor(repository: TagsRepository) {
        super(repository);
    }
}

@Injectable()
export class TagsCommandService extends CommandService<INewTag, ITag> {
    constructor(
        repository: TagsRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewTag) =>
                TagEntity.create(userId, newModel, entityService),
        );
    }
}
