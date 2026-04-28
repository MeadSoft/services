import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity } from '@meadsoft/common';
import { EntityService } from '@meadsoft/common-nestjs';
import { INewSize, ISize } from '@meadsoft/restaurant-catalog-contracts';

export class SizeEntity extends Entity implements ISize {
    public name!: string;

    public static create(
        userId: string,
        newSize: INewSize,
        entityService: EntityService,
    ): Result<SizeEntity, Error> {
        const size = new SizeEntity();
        if (!newSize.name || newSize.name.trim().length === EMPTY_LENGTH) {
            return Err(new Error('Size name cannot be empty'));
        }

        entityService.initialize(userId, size);
        size.name = newSize.name;
        return Ok(size);
    }

    // Factory method for reconstituting from database
    public static reconstitute(data: ISize): Result<SizeEntity, Error> {
        const size = new SizeEntity();
        Object.assign(size, data);
        return Ok(size);
    }

    toDTO(): ISize {
        return {
            id: this.id,
            name: this.name,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
