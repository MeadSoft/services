import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import {
    INewOrganizationalResource,
    IOrganizationalResource,
} from '@meadsoft/iam-contracts';
import { OrganizationalResourcesRepository } from '../database/repositories/organizational-resources.repo';
import { OrganizationalResourceEntity } from '../domain/organizational-resource.entity';

@Injectable()
export class OrganizationalResourceQueryService extends QueryService<IOrganizationalResource> {
    constructor(repository: OrganizationalResourcesRepository) {
        super(repository);
    }
}

@Injectable()
export class OrganizationalResourceCommandService extends CommandService<
    INewOrganizationalResource,
    IOrganizationalResource
> {
    constructor(
        repository: OrganizationalResourcesRepository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INewOrganizationalResource) =>
                OrganizationalResourceEntity.create(
                    userId,
                    newModel,
                    entityService,
                ),
        );
    }
}
