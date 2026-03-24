import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    MenuItemsCrudClient,
    MenuItemToSizeCrudClient,
    MenuItemToTagCrudClient,
    SizesCrudClient,
    TagsCrudClient,
} from '@meadsoft/restaurant-catalog-client-angular';
import { Config } from 'src/configs/config.schema';

@Injectable({
    providedIn: 'root',
})
export class RestaurantCatalogClientService {
    readonly menuItems: MenuItemsCrudClient;
    readonly sizes: SizesCrudClient;
    readonly tags: TagsCrudClient;
    readonly menuItemToSize: MenuItemToSizeCrudClient;
    readonly menuItemToTag: MenuItemToTagCrudClient;

    constructor(config: Config, http: HttpClient) {
        this.menuItems = new MenuItemsCrudClient(config.apiBaseUrl, http);
        this.sizes = new SizesCrudClient(config.apiBaseUrl, http);
        this.tags = new TagsCrudClient(config.apiBaseUrl, http);
        this.menuItemToSize = new MenuItemToSizeCrudClient(
            config.apiBaseUrl,
            http,
        );
        this.menuItemToTag = new MenuItemToTagCrudClient(
            config.apiBaseUrl,
            http,
        );
    }
}
