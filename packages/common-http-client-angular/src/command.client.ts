import { Entity } from '@meadsoft/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryClient } from './query.client';

export class CommandClient<
    TModel extends Entity,
    TNewModel,
> extends QueryClient<TModel> {
    constructor(
        public readonly basePath: string,
        public readonly resourceName: string,
        http: HttpClient,
    ) {
        super(basePath, resourceName, http);
    }

    create(item: TNewModel): Observable<TModel> {
        return this.http.post<TModel>(
            `${this.basePath}/${this.resourceName}`,
            item,
        );
    }

    update(id: string, updates: TModel): Observable<TModel | undefined> {
        return this.http.put<TModel>(
            `${this.basePath}/${this.resourceName}/${id}`,
            updates,
        );
    }

    delete(id: string): Observable<boolean> {
        return this.http.delete<boolean>(
            `${this.basePath}/${this.resourceName}/${id}`,
        );
    }
}
