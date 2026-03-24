import { inject, Injectable } from '@angular/core';
import { RestaurantCatalogClientService } from 'src/services/clients/restaurant-catalog-client.service';
import { MenuItemsStore } from './menu-items.store';

@Injectable({
    providedIn: 'root',
})
export class MenuItemsService {
    readonly restaurantCatalogClient = inject(RestaurantCatalogClientService);
    readonly store = inject(MenuItemsStore);
    readonly menuItems = this.store.menuItems;

    loadMenuItems(): void {
        this.restaurantCatalogClient.menuItems
            .findMany()
            .then((menuItems) => {
                this.store.setMenuItems(menuItems);
            })
            .catch(() => {
                this.store.setMenuItems([]);
            });
    }
}
