import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersComponent } from 'src/components/features/filters/filters.component';
import { FooterComponent } from 'src/components/features/footer/footer.component';
import { MenuItemComponent } from 'src/components/features/menu-item/menu-item.component';
import { MenuItemsService } from './menu-items.service';

@Component({
    selector: 'haru-landing-page-menu-section',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        FiltersComponent,
        MenuItemComponent,
        FooterComponent,
    ],
    templateUrl: './menu-section.component.html',
})
export class MenuSectionComponent implements OnInit {
    readonly menuItemsService = inject(MenuItemsService);
    readonly menuItems = this.menuItemsService.menuItems;

    ngOnInit(): void {
        this.menuItemsService.loadMenuItems();
    }
}
