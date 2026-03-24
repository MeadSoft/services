import { isPlatformBrowser } from '@angular/common';
import {
    Inject,
    Injectable,
    Optional,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { IColorScheme } from 'src/models/interfaces/IPrefersDarkMode';
import { DARK_MODE_CLASS } from 'src/theme.config';

export const DEFAULT_COLOR_SCHEME: IColorScheme = {
    prefersDarkMode: false,
};

@Injectable({
    providedIn: 'root',
})
export class ColorSchemeService {
    colorScheme = signal(DEFAULT_COLOR_SCHEME);

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional()
        @Inject('PREFERS_COLOR_SCHEME')
        private prefersColorScheme?: string,
    ) {}

    initializeTheme() {
        const colorScheme = this.getColorScheme();
        this.colorScheme.set(colorScheme);
    }

    getColorScheme(): IColorScheme {
        return {
            prefersDarkMode: this.prefersDarkMode(),
        };
    }

    prefersDarkMode(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.prefersColorScheme === 'dark';
    }

    toggleDarkMode() {
        const colorScheme = this.colorScheme();
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const element = document.querySelector('html')!;
        element.classList.toggle(DARK_MODE_CLASS);
        const isNowDarkMode = element.classList.contains(DARK_MODE_CLASS);
        if (colorScheme.prefersDarkMode !== isNowDarkMode) {
            this.colorScheme.update((prevColorScheme) => ({
                ...prevColorScheme,
                prefersDarkMode: isNowDarkMode,
            }));
        }
    }
}
