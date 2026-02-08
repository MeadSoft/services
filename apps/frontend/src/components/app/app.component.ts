import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { NavComponent } from '../nav/nav.component';

@Component({
    selector: 'haru-root',
    imports: [RouterOutlet],
    templateUrl: 'app.component.html',
})
export class AppComponent {}
