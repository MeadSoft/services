import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    INewPrinciple,
    IPrincipleWithRelations,
    PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME,
    PRINCIPLES_RESOURCE_NAME,
    SERVICE_NAME,
    type INewPrincipleLoginMethod,
    type IPrinciple,
} from '@meadsoft/iam-contracts';
import { PrincipleLoginMethodService } from './principle-login-method.service';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { SaltingService } from '@meadsoft/common-server';
import { PrincipleRepository } from '../database/repositories/principle.repo';
import { CommandService } from '@meadsoft/common-application';
import { PrincipleEntity } from '../domain/principle.entity';
import { IFilter } from '@meadsoft/common';
import { IamUnitOfWork } from '../database/iam-database.service';

@Injectable()
export class PrincipleService extends CommandService<
    INewPrinciple,
    IPrinciple
> {
    constructor(
        private readonly principleLoginMethodService: PrincipleLoginMethodService,
        entityService: EntityService,
        private readonly saltingService: SaltingService,
        private readonly principleRepo: PrincipleRepository,
        changeHistoryService: ChangeHistoryService,
        unitOfWork: IamUnitOfWork,
    ) {
        super(
            principleRepo,
            unitOfWork,
            entityService,
            changeHistoryService,
            () => {
                throw new Error(
                    'Creating a principle this way is not supported',
                );
            },
        );
    }

    /**
     * Registers a new principle with a local email and password.
     * @param email the email to register the principle with
     * @param password the password the principle could use to login
     * @param displayName the display name of the principle
     * @returns the created principle account
     */
    async registerWithLocalLogin(
        principleIdPerformingAction: string,
        email: string,
        password: string,
        displayName: string | null,
    ): Promise<IPrincipleWithRelations> {
        const emailFilter: IFilter = {
            service: SERVICE_NAME,
            resource: PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME,
            field: 'providerEmail',
            operator: 'eq',
            value: email,
        };
        const existingLocalLoginMethod =
            await this.principleLoginMethodService.findFirst([emailFilter]);
        if (existingLocalLoginMethod != null) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await this.saltingService.salt(password);
        const newPrincipleId = this.entityService.createId();
        const newLocalLoginMethod: INewPrincipleLoginMethod = {
            principleId: newPrincipleId,
            provider: 'local',
            providerPrincipleId: null,
            providerEmail: email,
            passwordHash: hashedPassword,
        };
        const principle = PrincipleEntity.create(
            newPrincipleId,
            principleIdPerformingAction,
            {
                email,
                displayName: displayName ?? email,
            },
            [newLocalLoginMethod],
            this.entityService,
        );
        return principle.unwrap();
    }

    async addLoginMethod(
        principleIdPerformingAction: string,
        principleId: string,
        loginMethod: INewPrincipleLoginMethod,
    ): Promise<void> {
        const idFilter: IFilter = {
            service: SERVICE_NAME,
            resource: PRINCIPLES_RESOURCE_NAME,
            field: 'id',
            operator: 'eq',
            value: principleId,
        };
        const existingPrinciple =
            await this.principleRepo.findFirstWithRelations([idFilter]);
        if (existingPrinciple.err) {
            throw existingPrinciple.val;
        }
        if (existingPrinciple.val == null) {
            throw new NotFoundException('Principle not found');
        }
        const principleLocalLoginMethodFilters: IFilter[] = [
            {
                service: SERVICE_NAME,
                resource: PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME,
                field: 'principleId',
                operator: 'eq',
                value: principleId,
            },
            {
                service: SERVICE_NAME,
                resource: PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME,
                field: 'provider',
                operator: 'eq',
                value: loginMethod.provider,
            },
        ];
        const existingLoginMethod =
            await this.principleLoginMethodService.findFirst(
                principleLocalLoginMethodFilters,
            );
        if (existingLoginMethod != null) {
            throw new ConflictException(
                `Login method for provider ${loginMethod.provider} already exists`,
            );
        }
        const principleEntity = PrincipleEntity.reconstitute(
            existingPrinciple.val,
        );
        if (principleEntity.err) {
            throw new Error('Failed to reconstitute principle entity');
        }
        principleEntity.val.addLoginMethod(
            principleIdPerformingAction,
            loginMethod,
            this.entityService,
        );
        await this.principleLoginMethodService.createOne(
            principleIdPerformingAction,
            loginMethod,
        );
    }
}
