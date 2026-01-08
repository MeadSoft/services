import { Ok, Result } from 'ts-results';
import { Entity, EntityService } from '@meadsoft/common';
import { IMenuItemToTag, INewMenuItemToTag } from '../menu-item-to-tag.schema';

export class MenuItemToTagEntity extends Entity implements IMenuItemToTag {
    menuItemId!: string;
    tagId!: string;

    public static create(
        userId: string,
        newMenuItemToTag: INewMenuItemToTag,
        entityService: EntityService,
    ): Result<MenuItemToTagEntity, Error> {
        const menuItemToTag = new MenuItemToTagEntity();
        entityService.initialize(userId, menuItemToTag);
        menuItemToTag.menuItemId = newMenuItemToTag.menuItemId;
        menuItemToTag.tagId = newMenuItemToTag.tagId;
        return Ok(menuItemToTag);
    }

    // Factory method for reconstituting from database
    public static reconstitute(
        data: IMenuItemToTag,
    ): Result<MenuItemToTagEntity, Error> {
        const menuItem = new MenuItemToTagEntity();
        Object.assign(menuItem, data);
        return Ok(menuItem);
    }

    toDTO(): IMenuItemToTag {
        return {
            id: this.id,
            menuItemId: this.menuItemId,
            tagId: this.tagId,
            createdById: this.createdById,
            createdDate: this.createdDate,
            updatedById: this.updatedById,
            updatedDate: this.updatedDate,
        };
    }
}
