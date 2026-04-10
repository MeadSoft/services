import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import type { IMenuItemWithRelations } from '@meadsoft/restaurant-catalog-contracts';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'haru-menu-item',
    imports: [
        CurrencyPipe,
        MatIconModule,
        MatRippleModule,
        CommonModule,
        ButtonModule,
    ],
    templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
    imageHeight = input<string>('20rem');
    infoHeight = input<string>('7rem');
    menuItem = input.required<IMenuItemWithRelations>();

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
