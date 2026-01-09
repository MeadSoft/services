import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import {
    INewTag,
    ITag,
    TagResourceName,
} from '@meadsoft/restaurant-catalog-contracts';

export class TagsCommandClient extends CrudClient<ITag, INewTag> {
    constructor(http: HttpClient) {
        super('', TagResourceName, http);
    }
}
