import { Ok, Result } from 'ts-results';
import { Entity } from '@meadsoft/common-server';
import { EntityService } from '@meadsoft/common-nestjs';
import {
    INewPolicyBinding,
    IPolicyBinding,
} from '@meadsoft/iam-contracts';

export class PolicyBindingEntity extends Entity implements IPolicyBinding {
    public policyId!: string;
    public roleId!: string;
    public principleIds!: string[];

    public static create(
        userId: string,
        newPolicyBinding: INewPolicyBinding,
        entityService: EntityService,
    ): Result<PolicyBindingEntity, Error> {
        const entity = new PolicyBindingEntity();

        entityService.initialize(userId, entity);
        entity.policyId = newPolicyBinding.policyId;
        entity.roleId = newPolicyBinding.roleId;
        entity.principleIds = newPolicyBinding.principleIds;
        return Ok(entity);
    }

    public static reconstitute(
        data: IPolicyBinding,
    ): Result<PolicyBindingEntity, Error> {
        const entity = new PolicyBindingEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): IPolicyBinding {
        return {
            id: this.id,
            policyId: this.policyId,
            roleId: this.roleId,
            principleIds: this.principleIds,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
