import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Component,
    computed,
    HostListener,
    inject,
    PLATFORM_ID,
    Signal,
    signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EMPTY_LENGTH } from '@meadsoft/common';
import { MenuItemsWithRelationsStore } from '@meadsoft/restaurant-catalog-http-client-angular';
import { IMenuItemWithRelations } from '@meadsoft/restaurant-catalog-contracts';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { FiltersComponent } from '@meadsoft/haru-cafe/components/features/filters/filters.component';
import { FooterComponent } from '@meadsoft/haru-cafe/components/features/footer/footer.component';
import { MenuItemComponent } from '@meadsoft/haru-cafe/components/features/menu-item/menu-item.component';
import { FilterService } from '@meadsoft/haru-cafe/services/filter.service';

const SMALL_ITEMS_PER_PAGE = 10;
const MEDIUM_ITEMS_PER_PAGE = 12;
const LARGE_ITEMS_PER_PAGE = 20;
const EXTRA_LARGE_ITEMS_PER_PAGE = 25;

const MEDIUM_BREAKPOINT = 768;
const LARGE_BREAKPOINT = 1024;
const EXTRA_LARGE_BREAKPOINT = 1280;

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
    protected readonly MENU_ITEM_HEIGHT = '20rem';
    private readonly platformId = inject(PLATFORM_ID);
    private readonly viewportWidth = signal<number>(EMPTY_LENGTH);

    readonly filterService = inject(FilterService);
    readonly menuItemsStore = inject(MenuItemsWithRelationsStore);
    menuItems = this.menuItemsStore.resource;

    constructor() {
        this.updateViewportWidth();
    }

    readonly itemsPerPage = computed(() => {
        const width = this.viewportWidth();
        if (width >= EXTRA_LARGE_BREAKPOINT) {
            return EXTRA_LARGE_ITEMS_PER_PAGE;
        }
        if (width >= LARGE_BREAKPOINT) {
            return LARGE_ITEMS_PER_PAGE;
        }
        if (width >= MEDIUM_BREAKPOINT) {
            return MEDIUM_ITEMS_PER_PAGE;
        }
        return SMALL_ITEMS_PER_PAGE;
    });

    readonly gridTemplateColumns = computed(() => {
        const width = this.viewportWidth();
        if (width >= EXTRA_LARGE_BREAKPOINT) {
            return `repeat(5, ${this.MENU_ITEM_HEIGHT})`;
        }
        if (width >= LARGE_BREAKPOINT) {
            return `repeat(4, ${this.MENU_ITEM_HEIGHT})`;
        }
        if (width >= MEDIUM_BREAKPOINT) {
            return `repeat(3, ${this.MENU_ITEM_HEIGHT})`;
        }
        return `repeat(2, ${this.MENU_ITEM_HEIGHT})`;
    });

    @HostListener('window:resize')
    onWindowResize(): void {
        this.updateViewportWidth();
    }

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
            const size = this.itemsPerPage();
            for (let i = 0; i < items.length; i += size) {
                pages.push(items.slice(i, i + size));
            }
            return pages;
        },
    );

    createEmptyArray(size: number): number[] {
        return Array.from({ length: size });
    }

    private updateViewportWidth(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.viewportWidth.set(window.innerWidth);
    }
}
