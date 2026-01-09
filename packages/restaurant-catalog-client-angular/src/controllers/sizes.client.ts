import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    INewSize,
    ISize,
    SizeResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class SizesCommandClient extends CrudClient<ISize, INewSize> {
    constructor(http: HttpClient) {
        super('', SizeResourceName, http);
    }
}
