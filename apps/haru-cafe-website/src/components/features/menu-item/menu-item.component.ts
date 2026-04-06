import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
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

    hasHotTag(): boolean {
        return this.menuItem().tags.some((t) => t.name.toLowerCase() === 'hot');
    }

    hasColdTag(): boolean {
        return this.menuItem().tags.some(
            (t) => t.name.toLowerCase() === 'cold',
        );
    }
}
