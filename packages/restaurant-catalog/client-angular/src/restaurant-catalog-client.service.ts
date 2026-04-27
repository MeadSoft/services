import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import {
    MenuItemsCrudClient,
    MenuItemToSizeCrudClient,
    MenuItemToTagCrudClient,
    SizesCrudClient,
    TagsCrudClient,
} from './controllers';

@Injectable()
export class RestaurantCatalogClients {
    readonly menuItems: MenuItemsCrudClient;
    readonly sizes: SizesCrudClient;
    readonly tags: TagsCrudClient;
    readonly menuItemToSize: MenuItemToSizeCrudClient;
    readonly menuItemToTag: MenuItemToTagCrudClient;

    constructor(
        @Inject(API_BASE_URL_TOKEN) apiBaseUrl: string,
        http: HttpClient,
    ) {
        this.menuItems = new MenuItemsCrudClient(apiBaseUrl, http);
        this.sizes = new SizesCrudClient(apiBaseUrl, http);
        this.tags = new TagsCrudClient(apiBaseUrl, http);
        this.menuItemToSize = new MenuItemToSizeCrudClient(apiBaseUrl, http);
        this.menuItemToTag = new MenuItemToTagCrudClient(apiBaseUrl, http);
    }
}
