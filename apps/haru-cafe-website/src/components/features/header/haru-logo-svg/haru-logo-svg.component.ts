import { Component, input } from '@angular/core';

@Component({
    selector: 'haru-logo-svg',
    imports: [],
    templateUrl: './haru-logo-svg.component.html',
})
export class HaruLogoSvgComponent {
    svgClass = input('');
}
