import { Component } from '@angular/core';

@Component({
    selector: 'haru-not-found',
    template: `
        <section class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
            <p class="text-sm uppercase tracking-[0.4em] text-slate-500">404</p>
            <h1 class="text-4xl font-semibold text-slate-900">Page not found</h1>
            <p class="max-w-xl text-base text-slate-600">
                The page you requested does not exist or is no longer available.
            </p>
            <a
                class="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                href="/"
            >
                Return home
            </a>
        </section>
    `,
})
export class NotFoundComponent {}