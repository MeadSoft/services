import {
    inject,
    Injectable,
    resource,
    ResourceRef,
    signal,
} from '@angular/core';
import type { ITag } from '@meadsoft/restaurant-catalog-contracts';
import { IResourceStore } from '@meadsoft/common-http-client-angular';
import { TagsCrudClient } from '../controllers';

@Injectable()
export class TagsStore implements IResourceStore<ITag[], object> {
    readonly tagsClient = inject(TagsCrudClient);
    readonly params = signal<object>({});
    readonly resource: ResourceRef<ITag[]> = resource({
        loader: this.tagsClient.findMany.bind(this.tagsClient),
        params: this.params,
        defaultValue: [],
    });
}
