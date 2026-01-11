import {
    Entity,
    ICrudClient,
    IFilter,
    NotImplementedException,
} from '@meadsoft/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { QueryClient } from './query.client';

export class CrudClient<TModel extends Entity, TNewModel>
    extends QueryClient<TModel>
    implements ICrudClient<TNewModel, TModel>
{
    constructor(
        protected readonly basePath: string,
        protected readonly resourceName: string,
        http: HttpClient,
    ) {
        super(basePath, resourceName, http);
    }

    async createOne(item: TNewModel): Promise<TModel> {
        return firstValueFrom(
            this.http.post<TModel>(
                `${this.basePath}/${this.resourceName}`,
                item,
            ),
        );
    }

    async createMany(...items: TNewModel[]): Promise<TModel[]> {
        console.log(items);
        return Promise.reject(new NotImplementedException());
    }

    async updateOne(id: string, updates: Partial<TModel>): Promise<TModel> {
        console.log(id, updates);
        return Promise.reject(new NotImplementedException());
    }

    async updateMany(
        updates: Partial<TModel>,
        ...filters: IFilter[]
    ): Promise<number> {
        console.log(updates, filters);
        return Promise.reject(new NotImplementedException());
    }

    async deleteOne(id: string): Promise<boolean> {
        console.log(id);
        return Promise.reject(new NotImplementedException());
    }

    async deleteMany(...filters: IFilter[]): Promise<number> {
        console.log(filters);
        return Promise.reject(new NotImplementedException());
    }

    async update(id: string, updates: TModel): Promise<TModel | undefined> {
        return firstValueFrom(
            this.http.put<TModel>(
                `${this.basePath}/${this.resourceName}/${id}`,
                updates,
            ),
        );
    }

    async delete(id: string): Promise<boolean> {
        return firstValueFrom(
            this.http.delete<boolean>(
                `${this.basePath}/${this.resourceName}/${id}`,
            ),
        );
    }
}
