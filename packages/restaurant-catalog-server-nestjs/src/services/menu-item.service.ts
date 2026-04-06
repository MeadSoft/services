import { Injectable } from '@nestjs/common';
import {
    IMenuItem,
    IMenuItemWithRelations,
    INewMenuItem,
} from '@meadsoft/restaurant-catalog-contracts';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { MenuItemRepository } from '../database/repositories/menu-items.repo';
import { MenuItemEntity } from '../domain/menu-item.entity';

@Injectable()
export class MenuItemQueryService extends QueryService<IMenuItem> {
    constructor(private readonly _repository: MenuItemRepository) {
        super(_repository);
    }

    async findOneWithRelations(
        id: string,
    ): Promise<IMenuItemWithRelations | null> {
        return await this._repository.findOneWithRelations(id);
    }

    async findManyWithRelations(): Promise<IMenuItemWithRelations[]> {
        return await this._repository.findManyWithRelations();
    }
}

@Injectable()
export class MenuItemCommandService extends CommandService<
    INewMenuItem,
    IMenuItem
> {
    constructor(
        repository: MenuItemRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewMenuItem) =>
                MenuItemEntity.create(userId, newModel, entityService),
        );
    }
}
