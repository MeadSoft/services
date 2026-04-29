import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity } from '@meadsoft/common';
import { EntityService } from '@meadsoft/common-nestjs';
import { INewPermission, IPermission } from '@meadsoft/iam-contracts';

export class PermissionEntity extends Entity implements IPermission {
    public name!: string;
    public description!: string | null;

    public static create(
        userId: string,
        newPermission: INewPermission,
        entityService: EntityService,
    ): Result<PermissionEntity, Error> {
        const entity = new PermissionEntity();
        if (
            !newPermission.name ||
            newPermission.name.trim().length === EMPTY_LENGTH
        ) {
            return Err(new Error('Permission name cannot be empty'));
        }

        entityService.initialize(userId, entity);
        entity.name = newPermission.name;
        entity.description = newPermission.description;
        return Ok(entity);
    }

    public static reconstitute(
        data: IPermission,
    ): Result<PermissionEntity, Error> {
        const entity = new PermissionEntity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): IPermission {
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
