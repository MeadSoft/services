import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type {
    INewPrincipleLoginMethod,
    IPrinciple,
    IPrincipleWithRelations,
} from '@meadsoft/iam-contracts';
import { PrincipleLoginMethodService } from './principle-login-method.service';
import { EntityService } from '@meadsoft/common-nestjs';
import { SaltingService } from '@meadsoft/common-server';
import { PrincipleRepository } from '../database/repositories/principle.repo';
import { QueryService } from '@meadsoft/common-application';
import { PrincipleEntity } from '../domain/principle.entity';

@Injectable()
export class PrincipleService extends QueryService<IPrinciple> {
    constructor(
        private readonly principleLoginMethodService: PrincipleLoginMethodService,
        private readonly entityService: EntityService,
        private readonly saltingService: SaltingService,
        private readonly principleRepo: PrincipleRepository,
    ) {
        super(principleRepo);
    }

    async findByEmail(email: string): Promise<IPrincipleWithRelations | null> {
        const principle = await this.principleRepo.findByEmail(email);
        if (principle == null) {
            return null;
        }
        const loginMethods =
            await this.principleLoginMethodService.findByEmail(email);
        const principleEntity = PrincipleEntity.reconstitute({
            ...principle,
            loginMethods: loginMethods ? [loginMethods] : [],
        });
        if (principleEntity.err) {
            throw new Error('Failed to reconstitute principle entity');
        }
        return principleEntity.val.toDTO();
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
    ): Promise<IPrinciple> {
        const existingLocalLoginMethod =
            await this.principleLoginMethodService.findByEmail(email);
        if (existingLocalLoginMethod) {
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
        const existingPrinciple = await this.principleRepo.findOne(principleId);
        if (existingPrinciple == null) {
            throw new NotFoundException('Principle not found');
        }
        const existingLoginMethods =
            await this.principleLoginMethodService.findByPrincipleId(
                principleId,
            );
        if (
            existingLoginMethods.some(
                (m) => m.provider === loginMethod.provider,
            )
        ) {
            throw new ConflictException(
                `Login method for provider ${loginMethod.provider} already exists`,
            );
        }
        const principleWithRelations: IPrincipleWithRelations = {
            ...existingPrinciple,
            loginMethods: existingLoginMethods,
        };
        const principleEntity = PrincipleEntity.reconstitute(
            principleWithRelations,
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
