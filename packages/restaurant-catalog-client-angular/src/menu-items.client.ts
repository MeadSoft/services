import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    IMenuItem,
    INewMenuItem,
    MenuItemResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class MenuItemsCrudClient extends CrudClient<IMenuItem, INewMenuItem> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, MenuItemResourceName, http);
    }
}
