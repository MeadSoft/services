import { Injectable } from '@nestjs/common';
import type {
    INewPrincipleLoginMethod,
    IPrincipleLoginMethod,
} from '@meadsoft/iam-contracts';
import { CommandService } from '@meadsoft/common-application';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { IamUnitOfWork } from '../database/iam-database.service';
import { PrincipleLoginMethodRepository } from '../database/repositories/principle-login-method.repo';
import { PrincipleLoginMethodEntity } from '../domain/principle-login-method.entity';

@Injectable()
export class PrincipleLoginMethodService extends CommandService<
    INewPrincipleLoginMethod,
    IPrincipleLoginMethod
> {
    constructor(
        loginMethodRepo: PrincipleLoginMethodRepository,
        entityService: EntityService,
        changeHistoryService: ChangeHistoryService,
        unitOfWork: IamUnitOfWork,
    ) {
        super(
            loginMethodRepo,
            unitOfWork,
            entityService,
            changeHistoryService,
            (userId, newModel) =>
                PrincipleLoginMethodEntity.create(
                    userId,
                    newModel,
                    entityService,
                ),
        );
    }
}
