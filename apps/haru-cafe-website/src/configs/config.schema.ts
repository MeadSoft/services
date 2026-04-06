import { FirebaseOptions } from '@angular/fire/app';

export interface IConfig {
    production: boolean;
    apiBaseUrl: string;
    firebase: FirebaseOptions;
}

export class Config implements IConfig {
    production = false;
    apiBaseUrl = '';
    firebase: FirebaseOptions = {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
    };
}
