import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuItemsWithRelationsStore } from '@meadsoft/restaurant-catalog-client-angular';
import { CarouselModule } from 'primeng/carousel';
import { FiltersComponent } from 'src/components/features/filters/filters.component';
import { FooterComponent } from 'src/components/features/footer/footer.component';
import { MenuItemComponent } from 'src/components/features/menu-item/menu-item.component';

@Component({
    selector: 'haru-landing-page-menu-section',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        CarouselModule,
        FiltersComponent,
        MenuItemComponent,
        FooterComponent,
    ],
    templateUrl: './menu-section.component.html',
})
export class MenuSectionComponent {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly PAGE_SIZE = 9;
    readonly menuItemsStore = inject(MenuItemsWithRelationsStore);
    menuItems = this.menuItemsStore.resource;
    readonly pagedMenuItems = computed(() => {
        if (!this.menuItems.hasValue()) {
            return [];
        }
        const items = this.menuItems.value();
        const pages: Array<typeof items> = [];
        for (let i = 0; i < items.length; i += this.PAGE_SIZE) {
            pages.push(items.slice(i, i + this.PAGE_SIZE));
        }
        return pages;
    });

    createEmptyArray(size: number): number[] {
        return Array.from({ length: size });
    }
}
