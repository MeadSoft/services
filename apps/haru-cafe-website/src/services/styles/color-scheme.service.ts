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

const COLOR_SCHEME_STORAGE_KEY = 'color-scheme';

@Injectable({
    providedIn: 'root',
})
export class ColorSchemeService {
    private readonly colorScheme_ = signal(DEFAULT_COLOR_SCHEME);
    colorScheme = this.colorScheme_.asReadonly();

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: object,
        @Optional()
        @Inject('PREFERS_COLOR_SCHEME')
        private readonly prefersColorScheme?: string,
    ) {}

    initializeTheme() {
        const colorScheme = this.getColorScheme();
        this.colorScheme_.set(colorScheme);
        this.applyColorScheme(colorScheme.prefersDarkMode);
    }

    applyColorScheme(prefersDarkMode: boolean) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const element = document.querySelector('html');
        element?.classList.toggle(DARK_MODE_CLASS, prefersDarkMode);
    }

    getColorScheme(): IColorScheme {
        return {
            prefersDarkMode: this.prefersDarkMode(),
        };
    }

    prefersDarkMode(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
            if (stored !== null) {
                return stored === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.prefersColorScheme === 'dark';
    }

    isHtmlDarkMode(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }
        const element = document.querySelector('html');
        return element?.classList.contains(DARK_MODE_CLASS) ?? false;
    }

    toggleDarkMode() {
        const colorScheme = this.colorScheme_();
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const element = document.querySelector('html');
        element?.classList.toggle(DARK_MODE_CLASS);
        const isNowDarkMode =
            element?.classList.contains(DARK_MODE_CLASS) ?? false;
        localStorage.setItem(
            COLOR_SCHEME_STORAGE_KEY,
            isNowDarkMode ? 'dark' : 'light',
        );
        if (colorScheme.prefersDarkMode !== isNowDarkMode) {
            this.colorScheme_.update((prevColorScheme) => ({
                ...prevColorScheme,
                prefersDarkMode: isNowDarkMode,
            }));
        }
    }
}
