import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ColorSchemeService } from 'src/services/styles/color-scheme.service';
import { NavComponent } from '../features/nav/nav.component';

@Component({
    selector: 'haru-root',
    imports: [RouterOutlet, NavComponent],
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    private readonly colorSchemeService = inject(ColorSchemeService);
    private readonly router = inject(Router);

    ngOnInit() {
        this.router.events
            .pipe(filter((e) => e instanceof NavigationEnd))
            .subscribe(() => {
                const { prefersDarkMode } = this.colorSchemeService.colorScheme();
                this.colorSchemeService.applyColorScheme(prefersDarkMode);
            });
    }
}
