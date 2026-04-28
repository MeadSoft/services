import { type Provider } from '@angular/core';
import {
    MenuItemToSizeStore,
    MenuItemToTagStore,
    MenuItemsWithRelationsStore,
    MenuItemsStore,
    SizesStore,
    TagsStore,
} from './stores';
import {
    MenuItemsCrudClient,
    MenuItemToSizeCrudClient,
    MenuItemToTagCrudClient,
    SizesCrudClient,
    TagsCrudClient,
} from './controllers';
import { RestaurantCatalogClients } from './restaurant-catalog-client.service';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';

const clients = [
    MenuItemToSizeCrudClient,
    MenuItemToTagCrudClient,
    MenuItemsCrudClient,
    SizesCrudClient,
    TagsCrudClient,
];

const stores = [
    MenuItemsStore,
    MenuItemsWithRelationsStore,
    SizesStore,
    TagsStore,
    MenuItemToSizeStore,
    MenuItemToTagStore,
];

export const RESTAURANT_CATALOG_CLIENT_PROVIDERS: Provider[] = [
    ...stores,
    ...clients,
    RestaurantCatalogClients,
];

export function provideRestaurantCatalog(apiBaseUrl: string): Provider[] {
    return [
        { provide: API_BASE_URL_TOKEN, useValue: apiBaseUrl },
        ...RESTAURANT_CATALOG_CLIENT_PROVIDERS,
    ];
}
