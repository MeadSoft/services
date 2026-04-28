import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { INewPolicyBinding, IPolicyBinding } from '@meadsoft/iam-contracts';
import { PolicyBindingsRepository } from '../database/repositories/policy-bindings.repo';
import { PolicyBindingEntity } from '../domain/policy-binding.entity';

@Injectable()
export class PolicyBindingQueryService extends QueryService<IPolicyBinding> {
    constructor(repository: PolicyBindingsRepository) {
        super(repository);
    }
}

@Injectable()
export class PolicyBindingCommandService extends CommandService<
    INewPolicyBinding,
    IPolicyBinding
> {
    constructor(
        repository: PolicyBindingsRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewPolicyBinding) =>
                PolicyBindingEntity.create(userId, newModel, entityService),
        );
    }
}
