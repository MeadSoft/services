import { Entity, IQueryClient } from '@meadsoft/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class QueryClient<
    TModel extends Entity,
> implements IQueryClient<TModel> {
    constructor(
        public readonly basePath: string,
        protected readonly resourceName: string,
        protected readonly http: HttpClient,
    ) {}

    getApiUrl(): string {
        return `${this.basePath}/${this.resourceName}`;
    }

    async countRows(): Promise<number> {
        return firstValueFrom(
            this.http.get<number>(`${this.getApiUrl()}/count`),
        );
    }

    async findOne(id: string): Promise<TModel | null> {
        return firstValueFrom(
            this.http.get<TModel>(`${this.getApiUrl()}/${id}`),
        );
    }

    async findMany(): Promise<TModel[]> {
        return firstValueFrom(this.http.get<TModel[]>(this.getApiUrl()));
    }
}
