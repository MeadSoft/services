import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderComponent } from '../../features/header/header.component';
import { MenuSectionComponent } from './components/menu-section/menu-section.component';

@Component({
    selector: 'haru-landing-page',
    imports: [CommonModule, HeaderComponent, MenuSectionComponent],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'instagram',
            sanitizer.bypassSecurityTrustResourceUrl('svgs/instagram.svg'),
        );
        iconRegistry.addSvgIcon(
            'uber-eats',
            sanitizer.bypassSecurityTrustResourceUrl('svgs/uber-eats.svg'),
        );
    }
}
