import { Ok, Result } from 'ts-results';
import { Entity, EntityService } from '@meadsoft/common';
import {
    IMenuItemToSize,
    INewMenuItemToSize,
} from '../menu-item-to-size.schema';

export class MenuItemToSizeEntity extends Entity implements IMenuItemToSize {
    menuItemId!: string;
    sizeId!: string;

    public static create(
        userId: string,
        newMenuItemToSize: INewMenuItemToSize,
        entityService: EntityService,
    ): Result<MenuItemToSizeEntity, Error> {
        const menuItemToSize = new MenuItemToSizeEntity();
        entityService.initialize(userId, menuItemToSize);
        menuItemToSize.menuItemId = newMenuItemToSize.menuItemId;
        menuItemToSize.sizeId = newMenuItemToSize.sizeId;
        return Ok(menuItemToSize);
    }

    // Factory method for reconstituting from database
    public static reconstitute(
        data: IMenuItemToSize,
    ): Result<MenuItemToSizeEntity, Error> {
        const menuItem = new MenuItemToSizeEntity();
        Object.assign(menuItem, data);
        return Ok(menuItem);
    }

    toDTO(): IMenuItemToSize {
        return {
            id: this.id,
            menuItemId: this.menuItemId,
            sizeId: this.sizeId,
            createdById: this.createdById,
            createdDate: this.createdDate,
            updatedById: this.updatedById,
            updatedDate: this.updatedDate,
        };
    }
}
