import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { FiltersComponent } from 'src/components/features/filters/filters.component';
import { FooterComponent } from 'src/components/features/footer/footer.component';
import { MenuItemComponent } from 'src/components/features/menu-item/menu-item.component';
import { MenuItemsService } from './menu-items.service';

const MENU_PAGE_TEMPLATE = 'xxxxxxxxx';

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
export class MenuSectionComponent implements OnInit {
    readonly menuItemsService = inject(MenuItemsService);
    readonly menuItems = this.menuItemsService.menuItems;
    readonly pageSize = MENU_PAGE_TEMPLATE.length;
    readonly pagedMenuItems = computed(() => {
        const items = this.menuItems();
        const pages: Array<typeof items> = [];

        for (let i = 0; i < items.length; i += this.pageSize) {
            pages.push(items.slice(i, i + this.pageSize));
        }

        return pages;
    });

    createEmptyArray(size: number): number[] {
        return Array.from({ length: size });
    }

    ngOnInit(): void {
        this.menuItemsService.loadMenuItems();
    }
}
