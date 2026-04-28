import {
    inject,
    Injectable,
    resource,
    ResourceRef,
    signal,
} from '@angular/core';
import type { IMenuItemToSize } from '@meadsoft/restaurant-catalog-contracts';
import { IResourceStore } from '@meadsoft/common-http-client-angular';
import { MenuItemToSizeCrudClient } from '../controllers';

@Injectable()
export class MenuItemToSizeStore implements IResourceStore<
    IMenuItemToSize[],
    object
> {
    readonly menuItemToSizeClient = inject(MenuItemToSizeCrudClient);
    readonly params = signal<object>({});
    readonly resource: ResourceRef<IMenuItemToSize[]> = resource({
        loader: this.menuItemToSizeClient.findMany.bind(
            this.menuItemToSizeClient,
        ),
        params: this.params,
        defaultValue: [],
    });
}
