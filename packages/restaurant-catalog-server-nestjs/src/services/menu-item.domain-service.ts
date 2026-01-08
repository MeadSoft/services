import { Injectable } from '@nestjs/common';
import { Err, Result } from 'ts-results';
import { DomainEventPublisher } from '@meadsoft/common-application';
import {
    IMenuItem,
    MenuItemEntity,
    NewMenuItem,
} from '@meadsoft/restaurant-catalog-contracts';
import { EntityService } from '@meadsoft/common';
import {
    MenuItemCommandService,
    MenuItemQueryService,
} from './menu-item.service';

@Injectable()
export class MenuItemDomainService {
    constructor(
        private readonly menuItemQueryService: MenuItemQueryService,
        private readonly menuItemCommandService: MenuItemCommandService,
        private readonly eventPublisher: DomainEventPublisher,
        private readonly entityService: EntityService,
    ) {}

    async create(
        newMenuItem: NewMenuItem,
        userId: string,
    ): Promise<Result<IMenuItem, Error>> {
        const menuItem = MenuItemEntity.create(
            userId,
            newMenuItem,
            this.entityService,
        );
        if (menuItem.err) {
            throw menuItem.val;
        }
        const savedMenuItem = await this.menuItemCommandService.createOne(
            userId,
            menuItem.val,
        );
        await this.eventPublisher.publishAll(menuItem.val.getDomainEvents());
        menuItem.val.clearDomainEvents();
        return savedMenuItem;
    }

    async update(
        id: string,
        menuItemUpdates: IMenuItem,
        userId: string,
    ): Promise<Result<IMenuItem, Error>> {
        const existingData = await this.menuItemQueryService.findOne(id);
        if (!existingData) {
            return Err(new Error('Menu item not found'));
        }
        const menuItem = MenuItemEntity.reconstitute(existingData);
        if (menuItem.err) {
            throw menuItem.val;
        }
        const updatedMenuItem = await this.menuItemCommandService.updateOne(
            userId,
            id,
            menuItemUpdates,
        );
        await this.eventPublisher.publishAll(menuItem.val.getDomainEvents());
        menuItem.val.clearDomainEvents();
        return updatedMenuItem;
    }
}
