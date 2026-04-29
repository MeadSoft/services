import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity, REGEX } from '@meadsoft/common';
import { EntityService } from '@meadsoft/common-nestjs';
import {
    IPrincipleLoginMethod,
    INewPrincipleLoginMethod,
} from '@meadsoft/iam-contracts';

export class PrincipleLoginMethodEntity
    extends Entity
    implements IPrincipleLoginMethod
{
    public isActive!: boolean;
    public linkedAt!: string;
    public principleId!: string;
    public provider!: 'google' | 'local';
    public providerPrincipleId!: string | null;
    public providerEmail!: string | null;
    public passwordHash!: string | null;

    static create(
        principleIdPerformingAction: string,
        newPrincipleLoginMethod: INewPrincipleLoginMethod,
        entityService: EntityService,
    ): Result<PrincipleLoginMethodEntity, Error> {
        const entity = new PrincipleLoginMethodEntity();
        // ensure email is valid if provided
        if (newPrincipleLoginMethod.providerEmail != null) {
            const email = newPrincipleLoginMethod.providerEmail.trim();
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

        entityService.initialize(principleIdPerformingAction, entity);
        return Ok(entity);
    }

    public static reconstitute(
        data: IPrincipleLoginMethod,
    ): Result<PrincipleLoginMethodEntity, Error> {
        const entity = new PrincipleLoginMethodEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): IPrincipleLoginMethod {
        return {
            id: this.id,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
            isActive: this.isActive,
            linkedAt: this.linkedAt,
            principleId: this.principleId,
            provider: this.provider,
            providerPrincipleId: this.providerPrincipleId,
            providerEmail: this.providerEmail,
            passwordHash: this.passwordHash,
        };
    }
}
