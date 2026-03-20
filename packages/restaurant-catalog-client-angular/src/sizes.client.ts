import { HttpClient } from '@angular/common/http';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import type { INewSize, ISize } from '@meadsoft/restaurant-catalog-contracts';

const SIZE_RESOURCE_NAME = 'size';

export class SizesCrudClient extends CrudClient<ISize, INewSize> {
    constructor(basePath: string, http: HttpClient) {
        super(basePath, SIZE_RESOURCE_NAME, http);
    }
}
