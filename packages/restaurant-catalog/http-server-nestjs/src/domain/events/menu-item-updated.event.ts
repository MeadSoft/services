import { DomainEvent } from '@meadsoft/common-application';
import { MenuItemEntity } from '../menu-item.entity';
import { IMenuItem } from '@meadsoft/restaurant-catalog-contracts';

export class MenuItemUpdatedEvent extends DomainEvent {
    public readonly menuItem: MenuItemEntity;
    public readonly changes: IMenuItem;

    constructor(menuItem: MenuItemEntity, changes: IMenuItem) {
        super();
        this.menuItem = menuItem;
        this.changes = changes;
    }

    getAggregateId(): string {
        return this.menuItem.id;
    }

    getEventName(): string {
        return 'MenuItemUpdated';
    }

    toJSON() {
        return {
            eventName: this.getEventName(),
            aggregateId: this.getAggregateId(),
            occurredOn: this.occurredOn,
            eventVersion: this.eventVersion,
            data: {
                id: this.menuItem.id,
                changes: this.changes,
                updatedById: this.menuItem.updatedById,
            },
        };
    }
}
