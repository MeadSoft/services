import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';
import { FirebaseConfig } from './firebase.config';

@Injectable()
export class FirebaseService {
    admin!: typeof admin;
    app!: admin.app.App;
    auth!: admin.auth.Auth;
    db!: admin.firestore.Firestore;
    storage!: admin.storage.Storage;

    constructor(private readonly config: FirebaseConfig) {
        this.initialize();
    }

    private initialize() {
        if (!this.config.env.FIREBASE_PRIVATE_KEY) {
            Logger.warn(
                'FIREBASE_PRIVATE_KEY not set — Firebase services disabled. ' +
                    'Set FIREBASE_PRIVATE_KEY in your .env file to enable Firebase.',
                FirebaseService.name,
            );
            return;
        }
        if (!admin.apps.length) {
            this.app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: this.config.file.project_id,
                    clientEmail: this.config.file.client_email ?? '',
                    privateKey: this.config.env.FIREBASE_PRIVATE_KEY.replace(
                        /\\n/g,
                        '\n',
                    ),
                }),
            });
        }
        this.admin = admin;
        this.auth = this.app.auth();
        this.db = this.app.firestore();
        this.storage = this.app.storage();
        Logger.log(
            'Firebase initialized successfully for project: ' +
                this.config.file.project_id,
            FirebaseService.name,
        );
    }
}
