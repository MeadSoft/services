import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import type { IMenuItemWithRelations } from '@meadsoft/restaurant-catalog-contracts';
import { ButtonModule } from 'primeng/button';
import { ImageDialogDirective } from 'src/directives/image-dialog.directive';

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
    menuItem = input.required<IMenuItemWithRelations>();
    isHovered = signal<boolean>(false);

    hasHotTag(): boolean {
        return this.menuItem().tags.some((t) => t.name.toLowerCase() === 'hot');
    }

    hasColdTag(): boolean {
        return this.menuItem().tags.some(
            (t) => t.name.toLowerCase() === 'cold',
        );
    }

    displayOnlyTags(): string[] {
        return this.menuItem()
            .tags.filter(
                (t) =>
                    t.name.toLowerCase() !== 'hot' &&
                    t.name.toLowerCase() !== 'drink' &&
                    t.name.toLowerCase() !== 'food' &&
                    t.name.toLowerCase() !== 'cold',
            )
            .map((t) => t.name);
    }
}
