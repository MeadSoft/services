import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import type {
    IMenuItem,
    ISize,
    ITag,
} from '@meadsoft/restaurant-catalog-contracts';
import { ButtonModule } from 'primeng/button';
import { ImageDialogDirective } from 'src/directives/image-dialog.directive';
import { RestaurantCatalogClientService } from 'src/services/clients/restaurant-catalog-client.service';

@Component({
    selector: 'haru-menu-item',
    imports: [
        CurrencyPipe,
        MatIconModule,
        MatRippleModule,
        ImageDialogDirective,
        CommonModule,
        ButtonModule,
    ],
    templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
    menuItem = input.required<IMenuItem>();
    relatedTags = signal<ITag[]>([]);
    relatedSizes = signal<ISize[]>([]);

    constructor(
        private readonly restaurantCatalogClient: RestaurantCatalogClientService,
    ) {}

    hasTagWithId(tagId: string): boolean {
        return this.relatedTags().some((tag) => tag.id === tagId);
    }

    loadTags(): void {
        this.restaurantCatalogClient.tags
            .findMany()
            .then((tags) => {
                this.relatedTags.set(tags);
            })
            .catch((error: unknown) => {
                console.error('Failed to load tags', error);
            });
    }

    loadSizes(): void {
        this.restaurantCatalogClient.sizes
            .findMany()
            .then((sizes) => {
                this.relatedSizes.set(sizes);
            })
            .catch((error: unknown) => {
                console.error('Failed to load sizes', error);
            });
    }
}
