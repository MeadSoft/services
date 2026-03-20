import { HttpClient } from '@angular/common/http';
import type {
    IMenuItemToSize,
    INewMenuItemToSize,
} from '@meadsoft/restaurant-catalog-contracts';
import { CrudClient } from '@meadsoft/common-http-client-angular';

const MENU_ITEM_TO_SIZE_RESOURCE_NAME = 'menu-item-to-size';

export class MenuItemToSizeCrudClient extends CrudClient<
    IMenuItemToSize,
    INewMenuItemToSize
> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, MENU_ITEM_TO_SIZE_RESOURCE_NAME, http);
    }
}
