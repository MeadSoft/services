import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Injectable } from '@angular/core';
import { Config } from 'src/configs/config.schema';

@Injectable()
export class FirebaseService {
    app?: FirebaseApp;
    analytics?: Analytics;

    constructor(private readonly config: Config) {}

    initialize() {
        this.app = initializeApp(this.config.firebase);
        this.analytics = getAnalytics(this.app);
    }
}
