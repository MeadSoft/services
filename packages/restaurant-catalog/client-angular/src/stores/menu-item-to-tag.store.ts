import {
    inject,
    Injectable,
    resource,
    ResourceRef,
    signal,
} from '@angular/core';
import type { IMenuItemToTag } from '@meadsoft/restaurant-catalog-contracts';
import { IResourceStore } from '@meadsoft/common-http-client-angular';
import { MenuItemToTagCrudClient } from '../controllers';

@Injectable()
export class MenuItemToTagStore implements IResourceStore<
    IMenuItemToTag[],
    object
> {
    readonly menuItemToTagClient = inject(MenuItemToTagCrudClient);
    readonly params = signal<object>({});
    readonly resource: ResourceRef<IMenuItemToTag[]> = resource({
        loader: this.menuItemToTagClient.findMany.bind(
            this.menuItemToTagClient,
        ),
        params: this.params,
        defaultValue: [],
    });
}
