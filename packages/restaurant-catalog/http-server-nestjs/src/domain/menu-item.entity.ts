import { Err, Ok, Result } from 'ts-results';
import { AggregateRoot } from '@meadsoft/common-application';
import { EMPTY_LENGTH } from '@meadsoft/common';
import { EntityService } from '@meadsoft/common-nestjs';
import { MenuItemCreatedEvent } from './events/menu-item-created.event';
import {
    IMenuItem,
    INewMenuItem,
} from '@meadsoft/restaurant-catalog-contracts';

export class MenuItemEntity extends AggregateRoot implements IMenuItem {
    public name!: string;
    public description!: string | null;
    public imageUrl!: string | null;
    public price!: number | null;
    public isFavorite!: boolean;
    public isActive!: boolean;

    public static create(
        userId: string,
        newMenuItem: INewMenuItem,
        entityService: EntityService,
    ): Result<MenuItemEntity, Error> {
        const menuItem = new MenuItemEntity();
        if (
            !newMenuItem.name ||
            newMenuItem.name.trim().length === EMPTY_LENGTH
        ) {
            return Err(new Error('Menu item name cannot be empty'));
        }

        if (newMenuItem.price !== null && newMenuItem.price < EMPTY_LENGTH) {
            return Err(new Error('Menu item price cannot be negative'));
        }
        entityService.initialize(userId, menuItem);
        menuItem.name = newMenuItem.name;
        menuItem.description = newMenuItem.description;
        menuItem.imageUrl = newMenuItem.imageUrl;
        menuItem.price = newMenuItem.price;
        menuItem.isFavorite = newMenuItem.isFavorite;
        menuItem.isActive = newMenuItem.isActive;
        menuItem.addDomainEvent(new MenuItemCreatedEvent(menuItem));
        return Ok(menuItem);
    }

    // Factory method for reconstituting from database
    public static reconstitute(data: IMenuItem): Result<MenuItemEntity, Error> {
        const menuItem = new MenuItemEntity();
        Object.assign(menuItem, data);
        return Ok(menuItem);
    }

    toDTO(): IMenuItem {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            imageUrl: this.imageUrl,
            price: this.price,
            isFavorite: this.isFavorite,
            isActive: this.isActive,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
