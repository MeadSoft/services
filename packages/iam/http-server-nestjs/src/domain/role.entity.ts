import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity } from '@meadsoft/common-server';
import { EntityService } from '@meadsoft/common-nestjs';
import { INewRole, IRole } from '@meadsoft/iam-contracts';

export class RoleEntity extends Entity implements IRole {
    public name!: string;
    public description!: string | null;

    public static create(
        userId: string,
        newRole: INewRole,
        entityService: EntityService,
    ): Result<RoleEntity, Error> {
        const entity = new RoleEntity();
        if (!newRole.name || newRole.name.trim().length === EMPTY_LENGTH) {
            return Err(new Error('Role name cannot be empty'));
        }

        entityService.initialize(userId, entity);
        entity.name = newRole.name;
        entity.description = newRole.description;
        return Ok(entity);
    }

    public static reconstitute(data: IRole): Result<RoleEntity, Error> {
        const entity = new RoleEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): IRole {
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
