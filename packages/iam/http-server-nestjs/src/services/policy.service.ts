import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { INewPolicy, IPolicy } from '@meadsoft/iam-contracts';
import { PoliciesRepository } from '../database/repositories/policies.repo';
import { PolicyEntity } from '../domain/policy.entity';

@Injectable()
export class PolicyQueryService extends QueryService<IPolicy> {
    constructor(repository: PoliciesRepository) {
        super(repository);
    }
}

@Injectable()
export class PolicyCommandService extends CommandService<INewPolicy, IPolicy> {
    constructor(
        repository: PoliciesRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewPolicy) =>
                PolicyEntity.create(userId, newModel, entityService),
        );
    }
}
