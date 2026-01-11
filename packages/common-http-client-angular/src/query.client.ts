import { Entity, IQueryClient } from '@meadsoft/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class QueryClient<
    TModel extends Entity,
> implements IQueryClient<TModel> {
    constructor(
        protected readonly base_path: string,
        protected readonly resource_name: string,
        protected readonly http: HttpClient,
    ) {}

    async countRows(): Promise<number> {
        return firstValueFrom(
            this.http.get<number>(
                `${this.base_path}/${this.resource_name}/count`,
            ),
        );
    }

    async findOne(id: string): Promise<TModel | null> {
        return firstValueFrom(
            this.http.get<TModel>(
                `${this.base_path}/${this.resource_name}/${id}`,
            ),
        );
    }

    async findMany(): Promise<TModel[]> {
        return firstValueFrom(
            this.http.get<TModel[]>(`${this.base_path}/${this.resource_name}`),
        );
    }
}
