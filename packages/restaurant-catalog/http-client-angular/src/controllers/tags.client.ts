import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import {
    TAG_RESOURCE_NAME,
    type INewTag,
    type ITag,
} from '@meadsoft/restaurant-catalog-contracts';

@Injectable()
export class TagsCrudClient extends CrudClient<ITag, INewTag> {
    constructor(
        @Inject(API_BASE_URL_TOKEN) basePath: string,
        http: HttpClient,
    ) {
        super(basePath, TAG_RESOURCE_NAME, http);
    }
}
