import {
    inject,
    Injectable,
    resource,
    ResourceRef,
    signal,
} from '@angular/core';
import type { ISize } from '@meadsoft/restaurant-catalog-contracts';
import { IResourceStore } from '@meadsoft/common-http-client-angular';
import { SizesCrudClient } from '../controllers';

@Injectable()
export class SizesStore implements IResourceStore<ISize[], object> {
    readonly sizesClient = inject(SizesCrudClient);
    readonly params = signal<object>({});
    readonly resource: ResourceRef<ISize[]> = resource({
        loader: this.sizesClient.findMany.bind(this.sizesClient),
        params: this.params,
        defaultValue: [],
    });
}
