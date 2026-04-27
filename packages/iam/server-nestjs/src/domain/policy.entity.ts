import { Ok, Result } from 'ts-results';
import { Entity } from '@meadsoft/common-server';
import { EntityService } from '@meadsoft/common-nestjs';
import { INewPolicy, IPolicy, PolicyTypeEnum } from '@meadsoft/iam-contracts';

export class PolicyEntity extends Entity implements IPolicy {
    public type!: PolicyTypeEnum;
    public organizationalResourceId!: string;

    public static create(
        userId: string,
        newPolicy: INewPolicy,
        entityService: EntityService,
    ): Result<PolicyEntity, Error> {
        const entity = new PolicyEntity();

        entityService.initialize(userId, entity);
        entity.type = newPolicy.type;
        entity.organizationalResourceId = newPolicy.organizationalResourceId;
        return Ok(entity);
    }

    public static reconstitute(data: IPolicy): Result<PolicyEntity, Error> {
        const entity = new PolicyEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): IPolicy {
        return {
            id: this.id,
            type: this.type,
            organizationalResourceId: this.organizationalResourceId,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
