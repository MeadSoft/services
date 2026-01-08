import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import {
    INewSize,
    ISize,
    SizeEntity,
} from '@meadsoft/restaurant-catalog-contracts';
import { SizesRepository } from '../database/repositories';

@Injectable()
export class SizeQueryService extends QueryService<ISize> {
    constructor(repository: SizesRepository) {
        super(repository);
    }
}

@Injectable()
export class SizeCommandService extends CommandService<INewSize, ISize> {
    constructor(
        repository: SizesRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewSize) =>
                SizeEntity.create(userId, newModel, entityService),
        );
    }
}
