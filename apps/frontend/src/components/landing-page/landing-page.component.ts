import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltersComponent } from 'src/components/filters/filters.component';
import { FooterComponent } from 'src/components/footer/footer.component';
import { MenuItemComponent } from 'src/components/menu-item/menu-item.component';
// import { LegacyCarouselComponent } from '../carousel-legacy/carousel.component';
import { FilterService } from 'src/services/filter.service';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../header/header.component';
import { RestaurantCatalogClientService } from 'src/services/clients/restaurant-catalog-client.service';
import { EMPTY_LENGTH } from '@meadsoft/common';
import { IMenuItem } from '@meadsoft/restaurant-catalog-contracts';

const PAGE_SIZE = 9;

@Component({
    selector: 'haru-landing-page',
    imports: [
        MenuItemComponent,
        FooterComponent,
        FiltersComponent,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        CommonModule,
        // LegacyCarouselComponent,
        ButtonModule,
        HeaderComponent,
    ],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
    createEmptyArray(length: number) {
        return new Array<unknown>(length);
    }

    PAGE_SIZE = PAGE_SIZE;
    menuItemsCount = EMPTY_LENGTH;
    pageCount = EMPTY_LENGTH;
    menuItems: IMenuItem[] = [];

    constructor(
        protected readonly restaurantCatalogClient: RestaurantCatalogClientService,
        protected readonly filterService: FilterService,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
    ) {
        iconRegistry.addSvgIcon(
            'instagram',
            sanitizer.bypassSecurityTrustResourceUrl('svgs/instagram.svg'),
        );
        iconRegistry.addSvgIcon(
            'uber-eats',
            sanitizer.bypassSecurityTrustResourceUrl('svgs/uber-eats.svg'),
        );
    }

    ngOnInit(): void {
        this.loadMenuItemCount();
        this.loadMenuItems();
    }

    loadMenuItemCount(): void {
        this.restaurantCatalogClient.menuItems
            .countRows()
            .then((count) => {
                this.menuItemsCount = count;
                this.pageCount = Math.ceil(this.menuItemsCount / PAGE_SIZE);
            })
            .catch(() => {
                this.menuItemsCount = 0;
                this.pageCount = 0;
            });
    }

    loadMenuItems(): void {
        this.restaurantCatalogClient.menuItems
            .findMany()
            .then((menuItems) => {
                this.menuItems = menuItems;
            })
            .catch(() => {
                this.menuItems = [];
            });
    }
}
