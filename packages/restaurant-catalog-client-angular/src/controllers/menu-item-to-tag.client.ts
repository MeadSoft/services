import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import {
    MENU_ITEM_TO_TAG_RESOURCE_NAME,
    type IMenuItemToTag,
    type INewMenuItemToTag,
} from '@meadsoft/restaurant-catalog-contracts';

@Injectable()
export class MenuItemToTagCrudClient extends CrudClient<
    IMenuItemToTag,
    INewMenuItemToTag
> {
    constructor(
        @Inject(API_BASE_URL_TOKEN) basePath: string,
        http: HttpClient,
    ) {
        super(basePath, MENU_ITEM_TO_TAG_RESOURCE_NAME, http);
    }
}
