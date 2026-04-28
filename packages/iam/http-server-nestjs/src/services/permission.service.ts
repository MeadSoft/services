import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { INewPermission, IPermission } from '@meadsoft/iam-contracts';
import { PermissionsRepository } from '../database/repositories/permissions.repo';
import { PermissionEntity } from '../domain/permission.entity';

@Injectable()
export class PermissionQueryService extends QueryService<IPermission> {
    constructor(repository: PermissionsRepository) {
        super(repository);
    }
}

@Injectable()
export class PermissionCommandService extends CommandService<
    INewPermission,
    IPermission
> {
    constructor(
        repository: PermissionsRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewPermission) =>
                PermissionEntity.create(userId, newModel, entityService),
        );
    }
}
