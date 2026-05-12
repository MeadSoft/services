import { Injectable } from '@nestjs/common';
import { Err, Result } from 'ts-results';
import { DomainEventPublisher } from '@meadsoft/common-application';
import {
    IMenuItem,
    INewMenuItem,
    SERVICE_NAME,
} from '@meadsoft/restaurant-catalog-contracts';
import { EntityService } from '@meadsoft/common-nestjs';
import {
    MenuItemCommandService,
    MenuItemQueryService,
} from './menu-item.service';
import { MenuItemEntity } from '../domain/menu-item.entity';
import { IFilter } from '@meadsoft/common';

@Injectable()
export class MenuItemDomainService {
    constructor(
        private readonly menuItemQueryService: MenuItemQueryService,
        private readonly menuItemCommandService: MenuItemCommandService,
        private readonly eventPublisher: DomainEventPublisher,
        private readonly entityService: EntityService,
    ) {}

    async create(
        newMenuItem: INewMenuItem,
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
        const idFilter: IFilter = {
            service: SERVICE_NAME,
            resource: 'menuItems',
            field: 'id',
            operator: 'eq',
            value: id,
        };
        const existingData = await this.menuItemQueryService.findFirst([
            idFilter,
        ]);
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
