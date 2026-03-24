import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../features/nav/nav.component';

@Component({
    selector: 'haru-root',
    imports: [RouterOutlet, NavComponent],
    templateUrl: 'app.component.html',
})
export class AppComponent {}
