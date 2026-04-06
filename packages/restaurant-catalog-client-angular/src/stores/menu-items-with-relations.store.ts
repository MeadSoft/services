import {
    inject,
    Injectable,
    resource,
    ResourceRef,
    signal,
} from '@angular/core';
import type { IMenuItemWithRelations } from '@meadsoft/restaurant-catalog-contracts';
import { IResourceStore } from '@meadsoft/common-http-client-angular';
import { MenuItemsCrudClient } from '../controllers';

@Injectable()
export class MenuItemsWithRelationsStore implements IResourceStore<
    IMenuItemWithRelations[],
    object
> {
    readonly menuItemsClient: MenuItemsCrudClient = inject(MenuItemsCrudClient);
    readonly params = signal<object>({});
    readonly resource: ResourceRef<IMenuItemWithRelations[]> = resource({
        loader: this.menuItemsClient.findManyWithRelations.bind(
            this.menuItemsClient,
        ),
        params: () => this.params(),
        defaultValue: [],
    });
}
