import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './components/app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
    console.error(error);
});
