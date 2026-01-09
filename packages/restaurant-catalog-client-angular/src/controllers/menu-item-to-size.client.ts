import { HttpClient } from '@angular/common/http';
import {
    IMenuItemToSize,
    INewMenuItemToSize,
    MenuItemToSizeResourceName,
} from '@meadsoft/restaurant-catalog-contracts';
import { CrudClient } from '@meadsoft/common-http-client-angular';

export class MenuItemToSizeCommandClient extends CrudClient<
    IMenuItemToSize,
    INewMenuItemToSize
> {
    constructor(http: HttpClient) {
        super('', MenuItemToSizeResourceName, http);
    }
}
