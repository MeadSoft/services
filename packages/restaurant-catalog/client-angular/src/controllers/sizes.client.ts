import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import {
    SIZE_RESOURCE_NAME,
    type INewSize,
    type ISize,
} from '@meadsoft/restaurant-catalog-contracts';

@Injectable()
export class SizesCrudClient extends CrudClient<ISize, INewSize> {
    constructor(
        @Inject(API_BASE_URL_TOKEN) basePath: string,
        http: HttpClient,
    ) {
        super(basePath, SIZE_RESOURCE_NAME, http);
    }
}
