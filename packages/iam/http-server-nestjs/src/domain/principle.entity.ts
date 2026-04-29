import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity, REGEX } from '@meadsoft/common';
import { EntityService } from '@meadsoft/common-nestjs';
import {
    INewPrinciple,
    INewPrincipleLoginMethod,
    IPrincipleWithRelations,
} from '@meadsoft/iam-contracts';
import { PrincipleLoginMethodEntity } from './principle-login-method.entity';

export class PrincipleEntity extends Entity implements IPrincipleWithRelations {
    public isActive!: boolean;
    public email!: string;
    public displayName!: string | null;
    public name!: string;
    public description!: string;
    public loginMethods!: PrincipleLoginMethodEntity[];

    public static create(
        id: string | null,
        principleIdPerformingAction: string,
        newPrinciple: INewPrinciple,
        loginMethods: INewPrincipleLoginMethod[],
        entityService: EntityService,
    ): Result<PrincipleEntity, Error> {
        const entity = new PrincipleEntity();
        // ensure display name is not empty
        if (
            newPrinciple.displayName == null ||
            newPrinciple.displayName.trim().length === EMPTY_LENGTH
        ) {
            return Err(new Error('Principle display name cannot be empty'));
        }

        // ensure email is valid if provided
        const email = newPrinciple.email.trim();
        if (email.length === EMPTY_LENGTH) {
            return Err(
                new Error('Principle email cannot be empty if provided'),
            );
        }
        if (!REGEX.EMAIL.test(email)) {
            return Err(
                new Error('Principle email must be a valid email address'),
            );
        }
        // ensure at least one login method is provided
        if (loginMethods.length === EMPTY_LENGTH) {
            return Err(
                new Error('Principle must have at least one login method'),
            );
        }

        entityService.initialize(principleIdPerformingAction, entity);
        if (id != null) {
            entity.id = id;
        }
        entity.email = newPrinciple.email;
        entity.displayName = newPrinciple.displayName;
        entity.isActive = true;
        for (const loginMethod of loginMethods) {
            const addLoginMethodResult = entity.addLoginMethod(
                principleIdPerformingAction,
                loginMethod,
                entityService,
            );
            if (addLoginMethodResult.err) {
                return Err(addLoginMethodResult.val);
            }
        }
        return Ok(entity);
    }

    public static reconstitute(
        data: IPrincipleWithRelations,
    ): Result<PrincipleEntity, Error> {
        const entity = new PrincipleEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    addLoginMethod(
        principleIdPerformingAction: string,
        loginMethod: INewPrincipleLoginMethod,
        entityService: EntityService,
    ): Result<void, Error> {
        // ensure email is valid if provided
        if (loginMethod.providerEmail != null) {
            const email = loginMethod.providerEmail.trim();
            if (email.length === EMPTY_LENGTH) {
                return Err(
                    new Error('Principle email cannot be empty if provided'),
                );
            }
            if (!REGEX.EMAIL.test(email)) {
                return Err(
                    new Error('Principle email must be a valid email address'),
                );
            }
        }
        const loginMethodEntityResult = PrincipleLoginMethodEntity.create(
            principleIdPerformingAction,
            loginMethod,
            entityService,
        );
        if (loginMethodEntityResult.err) {
            return Err(loginMethodEntityResult.val);
        }
        this.loginMethods.push(loginMethodEntityResult.val);
        return Ok(undefined);
    }

    toDTO(): IPrincipleWithRelations {
        return {
            id: this.id,
            email: this.email,
            displayName: this.displayName,
            isActive: this.isActive,
            loginMethods: this.loginMethods.map((lm) => lm.toDTO()),
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
