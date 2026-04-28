import { DomainEvent } from '@meadsoft/common-application';
import { MenuItemEntity } from '../menu-item.entity';

export class MenuItemCreatedEvent extends DomainEvent {
    public readonly menuItem: MenuItemEntity;

    constructor(menuItem: MenuItemEntity) {
        super();
        this.menuItem = menuItem;
    }

    getAggregateId(): string {
        return this.menuItem.id;
    }

    getEventName(): string {
        return 'MenuItemCreated';
    }

    toJSON() {
        return {
            eventName: this.getEventName(),
            aggregateId: this.getAggregateId(),
            occurredOn: this.occurredOn,
            eventVersion: this.eventVersion,
            data: {
                id: this.menuItem.id,
                name: this.menuItem.name,
                description: this.menuItem.description,
                imageUrl: this.menuItem.imageUrl,
                price: this.menuItem.price,
                isFavorite: this.menuItem.isFavorite,
                isActive: this.menuItem.isActive,
                createdById: this.menuItem.createdById,
            },
        };
    }
}
