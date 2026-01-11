import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    IMenuItemToTag,
    INewMenuItemToTag,
    MenuItemToTagResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class MenuItemToTagCrudClient extends CrudClient<
    IMenuItemToTag,
    INewMenuItemToTag
> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, MenuItemToTagResourceName, http);
    }
}
