import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import type {
    IMenuItemToTag,
    INewMenuItemToTag,
} from '@meadsoft/restaurant-catalog-contracts';

const MENU_ITEM_TO_TAG_RESOURCE_NAME = 'menu-item-to-tag';

export class MenuItemToTagCrudClient extends CrudClient<
    IMenuItemToTag,
    INewMenuItemToTag
> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, MENU_ITEM_TO_TAG_RESOURCE_NAME, http);
    }
}
