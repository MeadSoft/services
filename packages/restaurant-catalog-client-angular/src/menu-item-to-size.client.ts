import { HttpClient } from '@angular/common/http';
import {
    IMenuItemToSize,
    INewMenuItemToSize,
    MenuItemToSizeResourceName,
} from '@meadsoft/restaurant-catalog-contracts';
import { CrudClient } from '@meadsoft/common-http-client-angular';

export class MenuItemToSizeCrudClient extends CrudClient<
    IMenuItemToSize,
    INewMenuItemToSize
> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, MenuItemToSizeResourceName, http);
    }
}
