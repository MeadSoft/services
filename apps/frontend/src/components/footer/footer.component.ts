import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'haru-footer',
    imports: [MatButtonModule, MatTooltipModule],
    templateUrl: './footer.component.html',
})
export class FooterComponent {}
