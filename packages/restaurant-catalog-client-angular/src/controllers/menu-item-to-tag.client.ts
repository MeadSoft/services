import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    IMenuItemToTag,
    INewMenuItemToTag,
    MenuItemToTagResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class MenuItemToTagCommandClient extends CrudClient<
    IMenuItemToTag,
    INewMenuItemToTag
> {
    constructor(http: HttpClient) {
        super('', MenuItemToTagResourceName, http);
    }
}
