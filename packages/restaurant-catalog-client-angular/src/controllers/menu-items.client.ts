import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CrudClient } from '@meadsoft/common-http-client-angular';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import {
    IMenuItemWithRelations,
    MENU_ITEM_RESOURCE_NAME,
    type IMenuItem,
    type INewMenuItem,
} from '@meadsoft/restaurant-catalog-contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MenuItemsCrudClient extends CrudClient<IMenuItem, INewMenuItem> {
    constructor(
        @Inject(API_BASE_URL_TOKEN) basePath: string,
        http: HttpClient,
    ) {
        super(basePath, MENU_ITEM_RESOURCE_NAME, http);
    }

    async findOneWithRelations(
        id: string,
    ): Promise<IMenuItemWithRelations | null> {
        return await firstValueFrom(
            this.http.get<IMenuItemWithRelations>(
                `${this.getApiUrl()}/${id}/with-relations`,
            ),
        );
    }

    async findManyWithRelations(): Promise<IMenuItemWithRelations[]> {
        return await firstValueFrom(
            this.http.get<IMenuItemWithRelations[]>(
                `${this.getApiUrl()}/with-relations`,
            ),
        );
    }
}
