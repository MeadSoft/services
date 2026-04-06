import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
    MENU_ITEM_TO_SIZE_RESOURCE_NAME,
    type IMenuItemToSize,
    type INewMenuItemToSize,
} from '@meadsoft/restaurant-catalog-contracts';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';

@Injectable()
export class MenuItemToSizeCrudClient extends CrudClient<
    IMenuItemToSize,
    INewMenuItemToSize
> {
    constructor(
        @Inject(API_BASE_URL_TOKEN) basePath: string,
        http: HttpClient,
    ) {
        super(basePath, MENU_ITEM_TO_SIZE_RESOURCE_NAME, http);
    }
}
