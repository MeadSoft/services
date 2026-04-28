import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { INewRole, IRole } from '@meadsoft/iam-contracts';
import { RolesRepository } from '../database/repositories/roles.repo';
import { RoleEntity } from '../domain/role.entity';

@Injectable()
export class RoleQueryService extends QueryService<IRole> {
    constructor(repository: RolesRepository) {
        super(repository);
    }
}

@Injectable()
export class RoleCommandService extends CommandService<INewRole, IRole> {
    constructor(
        repository: RolesRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewRole) =>
                RoleEntity.create(userId, newModel, entityService),
        );
    }
}
