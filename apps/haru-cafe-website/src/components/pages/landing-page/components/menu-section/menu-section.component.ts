import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EMPTY_LENGTH } from '@meadsoft/common-browser';
import { MenuItemsWithRelationsStore } from '@meadsoft/restaurant-catalog-client-angular';
import { IMenuItemWithRelations } from '@meadsoft/restaurant-catalog-contracts';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { FiltersComponent } from 'src/components/features/filters/filters.component';
import { FooterComponent } from 'src/components/features/footer/footer.component';
import { MenuItemComponent } from 'src/components/features/menu-item/menu-item.component';
import { FilterService } from 'src/services/filter.service';

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
        TooltipModule,
        SkeletonModule,
    ],
    templateUrl: './menu-section.component.html',
})
export class MenuSectionComponent {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly PAGE_SIZE = 9;
    readonly filterService = inject(FilterService);
    readonly menuItemsStore = inject(MenuItemsWithRelationsStore);
    menuItems = this.menuItemsStore.resource;
    readonly filteredMenuItems: Signal<IMenuItemWithRelations[]> = computed(
        () => {
            if (!this.menuItems.hasValue()) {
                return [];
            }
            const activeTags = this.filterService.activeTags();
            if (activeTags.length === EMPTY_LENGTH) {
                return this.menuItems.value();
            }
            const filteredItems = this.menuItems
                .value()
                .filter((item) =>
                    activeTags.every((activeTag) =>
                        item.tags.some((tag) => activeTag.id === tag.id),
                    ),
                );
            return filteredItems;
        },
    );
    readonly pagedMenuItems: Signal<IMenuItemWithRelations[][]> = computed(
        () => {
            const items = this.filteredMenuItems();
            const pages: Array<typeof items> = [];
            for (let i = 0; i < items.length; i += this.PAGE_SIZE) {
                pages.push(items.slice(i, i + this.PAGE_SIZE));
            }
            return pages;
        },
    );

    createEmptyArray(size: number): number[] {
        return Array.from({ length: size });
    }
}
