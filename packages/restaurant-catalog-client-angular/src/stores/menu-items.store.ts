import {
    inject,
    Injectable,
    resource,
    ResourceRef,
    signal,
} from '@angular/core';
import type { IMenuItem } from '@meadsoft/restaurant-catalog-contracts';
import { IResourceStore } from '@meadsoft/common-http-client-angular';
import { MenuItemsCrudClient } from '../controllers';

@Injectable()
export class MenuItemsStore implements IResourceStore<IMenuItem[], object> {
    readonly menuItemsClient: MenuItemsCrudClient = inject(MenuItemsCrudClient);
    readonly params = signal<object>({});
    readonly resource: ResourceRef<IMenuItem[]> = resource({
        loader: this.menuItemsClient.findMany.bind(this.menuItemsClient),
        params: this.params,
        defaultValue: [],
    });
}
