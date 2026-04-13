import zod from 'zod';
import { Inject, Provider } from '@nestjs/common';
import {
    CONFIG_PATH_TOKEN,
    createConfigProvider,
    createJsonAndEnvConfigLoader,
    DEFAULT_CONFIG_SCHEMA,
    IFileAndEnvConfig,
    JsonAndEnvConfigLoader,
    REGEX,
    ZodSchema,
} from '@meadsoft/common-server';

export const FIREBASE_CONFIG_KEY = 'firebase';
export const FirebaseJsonConfigSchema = zod.object({
    type: zod.string(),
    project_id: zod.string(),
    client_email: zod.string().regex(REGEX.EMAIL).nullable(),
    client_id: zod.string(),
    auth_uri: zod.string(),
    token_uri: zod.string(),
    auth_provider_x509_cert_url: zod.string(),
    client_x509_cert_url: zod.string(),
    universe_domain: zod.string(),
});
export const FirebaseEnvConfigSchema = zod
    .object({
        FIREBASE_PRIVATE_KEY_ID: zod.string().nullable(),
        FIREBASE_PRIVATE_KEY: zod.string().nullable(),
    })
    .extend(DEFAULT_CONFIG_SCHEMA.shape);
export type IFirebaseJsonConfig = zod.infer<typeof FirebaseJsonConfigSchema>;
export type IFirebaseEnvConfig = zod.infer<typeof FirebaseEnvConfigSchema>;
export class FirebaseConfig implements IFileAndEnvConfig<
    IFirebaseJsonConfig,
    IFirebaseEnvConfig
> {
    file: IFirebaseJsonConfig = {
        type: '',
        project_id: '',
        client_email: '',
        client_id: '',
        auth_uri: '',
        token_uri: '',
        auth_provider_x509_cert_url: '',
        client_x509_cert_url: '',
        universe_domain: '',
    };
    env: IFirebaseEnvConfig = {
        FIREBASE_PRIVATE_KEY_ID: null,
        FIREBASE_PRIVATE_KEY: null,
        APP_ENV: '',
    };
}

export class FirebaseConfigLoader extends JsonAndEnvConfigLoader<
    IFirebaseJsonConfig,
    IFirebaseEnvConfig
> {
    constructor(@Inject(CONFIG_PATH_TOKEN) configFileDirectory: string) {
        const { jsonConfigLoader, envConfigLoader } =
            createJsonAndEnvConfigLoader<
                IFirebaseJsonConfig,
                IFirebaseEnvConfig
            >(
                'firebase',
                new ZodSchema(FirebaseJsonConfigSchema),
                configFileDirectory,
            );
        super(jsonConfigLoader, envConfigLoader);
    }
}

export const FirebaseConfigProvider: Provider = createConfigProvider(
    FirebaseConfig,
    FirebaseConfigLoader,
);
