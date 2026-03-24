import { Injectable, signal } from '@angular/core';
import type { IMenuItem } from '@meadsoft/restaurant-catalog-contracts';

@Injectable({
    providedIn: 'root',
})
export class MenuItemsStore {
    private readonly _menuItems = signal<IMenuItem[]>([]);

    readonly menuItems = this._menuItems.asReadonly();

    setMenuItems(menuItems: IMenuItem[]): void {
        this._menuItems.set(menuItems);
    }
}
