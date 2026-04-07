import { Injectable, signal } from '@angular/core';
import { ITag } from '@meadsoft/restaurant-catalog-contracts';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    activeTags = signal<ITag[]>([]);
}
