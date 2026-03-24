import { Component } from '@angular/core';
import { HaruLogoSvgComponent } from './haru-logo-svg/haru-logo-svg.component';
import { HaruLogoTextComponent } from './haru-logo-text/haru-logo-text.component';

@Component({
    selector: 'haru-header',
    imports: [HaruLogoSvgComponent, HaruLogoTextComponent],
    templateUrl: './header.component.html',
    styles: ``,
})
export class HeaderComponent {}
