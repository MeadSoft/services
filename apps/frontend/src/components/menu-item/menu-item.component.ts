import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY_LENGTH } from '@meadsoft/common';
import { IMenuItem, ISize, ITag } from '@meadsoft/restaurant-catalog-contracts';
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
    ],
    templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
    menuItem = input.required<IMenuItem>();
    isDetailShown = signal<boolean>(false);
    hasDetail = computed<boolean>(
        () =>
            this.menuItem().imageUrl !== '' ||
            (typeof this.menuItem().description === 'string' &&
                (this.menuItem().description ?? '').length > EMPTY_LENGTH),
    );

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
