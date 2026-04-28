import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity } from '@meadsoft/common-server';
import { EntityService } from '@meadsoft/common-nestjs';
import {
    INewOrganizationalResource,
    IOrganizationalResource,
} from '@meadsoft/iam-contracts';

export class OrganizationalResourceEntity
    extends Entity
    implements IOrganizationalResource
{
    public name!: string;
    public description!: string | null;

    public static create(
        userId: string,
        newOrganizationalResource: INewOrganizationalResource,
        entityService: EntityService,
    ): Result<OrganizationalResourceEntity, Error> {
        const entity = new OrganizationalResourceEntity();
        if (
            !newOrganizationalResource.name ||
            newOrganizationalResource.name.trim().length === EMPTY_LENGTH
        ) {
            return Err(
                new Error('Organizational resource name cannot be empty'),
            );
        }

        entityService.initialize(userId, entity);
        entity.name = newOrganizationalResource.name;
        entity.description = newOrganizationalResource.description;
        return Ok(entity);
    }

    public static reconstitute(
        data: IOrganizationalResource,
    ): Result<OrganizationalResourceEntity, Error> {
        const entity = new OrganizationalResourceEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): IOrganizationalResource {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
