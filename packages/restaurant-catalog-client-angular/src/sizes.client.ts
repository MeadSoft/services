import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    INewSize,
    ISize,
    SizeResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class SizesCrudClient extends CrudClient<ISize, INewSize> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, SizeResourceName, http);
    }
}
