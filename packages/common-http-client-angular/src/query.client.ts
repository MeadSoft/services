import { Entity } from '@meadsoft/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class QueryClient<TModel extends Entity> {
    constructor(
        protected readonly base_path: string,
        protected readonly resource_name: string,
        protected readonly http: HttpClient,
    ) {}

    findById(id: string): Observable<TModel | null> {
        return this.http.get<TModel>(
            `${this.base_path}/${this.resource_name}/${id}`,
        );
    }

    findAll(): Observable<TModel[]> {
        return this.http.get<TModel[]>(
            `${this.base_path}/${this.resource_name}`,
        );
    }
}
