import {
    BootstrapContext,
    bootstrapApplication,
} from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { serverConfig as serverConfig } from './app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, serverConfig, context);

export default bootstrap;
