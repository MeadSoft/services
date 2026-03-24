import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    activeTags = signal<string[]>([]);
}
