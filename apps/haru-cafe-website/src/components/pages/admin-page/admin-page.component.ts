import { Component, signal } from '@angular/core';
import { AdminMenuItemsComponent } from './components/admin-menu-items/admin-menu-items.component';
import { AdminTagsComponent } from './components/admin-tags/admin-tags.component';
import { AdminSizesComponent } from './components/admin-sizes/admin-sizes.component';

type AdminTab = 'menu-items' | 'tags' | 'sizes';

const TABS: { id: AdminTab; label: string }[] = [
    { id: 'menu-items', label: 'Menu Items' },
    { id: 'tags', label: 'Tags' },
    { id: 'sizes', label: 'Sizes' },
];

@Component({
    selector: 'haru-admin-page',
    imports: [AdminMenuItemsComponent, AdminTagsComponent, AdminSizesComponent],
    templateUrl: './admin-page.component.html',
})
export class AdminPageComponent {
    protected readonly tabs = TABS;
    readonly activeTab = signal<AdminTab>('menu-items');

    setTab(tab: AdminTab): void {
        this.activeTab.set(tab);
    }
}
