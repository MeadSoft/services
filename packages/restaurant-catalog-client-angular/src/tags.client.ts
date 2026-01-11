import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    INewTag,
    ITag,
    TagResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class TagsCrudClient extends CrudClient<ITag, INewTag> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, TagResourceName, http);
    }
}
