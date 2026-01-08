import { Injectable } from '@nestjs/common';
import {
    IMenuItemToSize,
    INewMenuItemToSize,
    MenuItemToSizeEntity,
} from '@meadsoft/restaurant-catalog-contracts';
import { ChangeHistoryService, EntityService } from '@meadsoft/common';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { MenuItemToSizeRepository } from '../database/repositories';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';

@Injectable()
export class MenuItemToSizeQueryService extends QueryService<IMenuItemToSize> {
    constructor(repository: MenuItemToSizeRepository) {
        super(repository);
    }
}

@Injectable()
export class MenuItemToSizeCommandService extends CommandService<
    INewMenuItemToSize,
    IMenuItemToSize
> {
    constructor(
        repository: MenuItemToSizeRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewMenuItemToSize) =>
                MenuItemToSizeEntity.create(userId, newModel, entityService),
        );
    }
}
