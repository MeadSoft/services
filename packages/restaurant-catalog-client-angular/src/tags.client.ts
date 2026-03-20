import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import type { INewTag, ITag } from '@meadsoft/restaurant-catalog-contracts';

const TAG_RESOURCE_NAME = 'tag';

export class TagsCrudClient extends CrudClient<ITag, INewTag> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, TAG_RESOURCE_NAME, http);
    }
}
