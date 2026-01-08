import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity, EntityService } from '@meadsoft/common';
import { IMenuItem } from '../menu-item.schema';
import { ITag, INewTag } from '../tags.schema';

export class TagEntity extends Entity implements ITag {
    public name!: string;

    public static create(
        userId: string,
        newTag: INewTag,
        entityService: EntityService,
    ): Result<TagEntity, Error> {
        const tag = new TagEntity();
        if (!newTag.name || newTag.name.trim().length === EMPTY_LENGTH) {
            return Err(new Error('Tag name cannot be empty'));
        }

        entityService.initialize(userId, tag);
        tag.name = newTag.name;
        return Ok(tag);
    }

    // Factory method for reconstituting from database
    public static reconstitute(data: IMenuItem): Result<TagEntity, Error> {
        const tag = new TagEntity();
        Object.assign(tag, data);
        return Ok(tag);
    }

    toDTO(): ITag {
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
