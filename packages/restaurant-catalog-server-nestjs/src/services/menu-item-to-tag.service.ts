import { Injectable } from '@nestjs/common';
import {
    IMenuItemToTag,
    INewMenuItemToTag,
    MenuItemToTagEntity,
} from '@meadsoft/restaurant-catalog-contracts';
import { ChangeHistoryService, EntityService } from '@meadsoft/common';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { MenuItemToTagRepository } from '../database/repositories';

@Injectable()
export class MenuItemToTagQueryService extends QueryService<IMenuItemToTag> {
    constructor(repository: MenuItemToTagRepository) {
        super(repository);
    }
}

@Injectable()
export class MenuItemToTagCommandService extends CommandService<
    INewMenuItemToTag,
    IMenuItemToTag
> {
    constructor(
        repository: MenuItemToTagRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewMenuItemToTag) =>
                MenuItemToTagEntity.create(userId, newModel, entityService),
        );
    }
}
