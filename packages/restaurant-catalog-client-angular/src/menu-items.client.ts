import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import type {
    IMenuItem,
    INewMenuItem,
} from '@meadsoft/restaurant-catalog-contracts';

const MENU_ITEM_API_RESOURCE_NAME = 'menu-item';

export class MenuItemsCrudClient extends CrudClient<IMenuItem, INewMenuItem> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, MENU_ITEM_API_RESOURCE_NAME, http);
    }
}
