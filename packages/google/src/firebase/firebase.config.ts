import zod from 'zod';
import path from 'path';
import { Injectable, Provider } from '@nestjs/common';
import {
    EnvConfigLoader,
    EnvironmentConfigSchema,
    FileAndEnvConfig,
    IBaseEnvConfig,
    JsonAndEnvConfigLoader,
    JsonConfigLoader,
    REGEX,
    ZodSchema,
} from '@meadsoft/common-server';

export const FIREBASE_CONFIG_KEY = 'firebase';

export interface IFirebaseJsonConfig {
    type: string | null;
    project_id: string | null;
    client_email: string | null;
    client_id: string | null;
    auth_uri: string | null;
    token_uri: string | null;
    auth_provider_x509_cert_url: string | null;
    client_x509_cert_url: string | null;
    universe_domain: string | null;
}

@Injectable()
export class FirebaseJsonConfig implements IFirebaseJsonConfig {
    constructor(
        readonly type: string,
        readonly project_id: string,
        readonly client_email: string | null = null,
        readonly client_id: string | null = null,
        readonly auth_uri: string | null = null,
        readonly token_uri: string | null = null,
        readonly auth_provider_x509_cert_url: string | null = null,
        readonly client_x509_cert_url: string | null = null,
        readonly universe_domain: string | null = null,
    ) {}
}

export interface IFirebaseEnvironmentConfig extends IBaseEnvConfig {
    FIREBASE_PRIVATE_KEY_ID: string | null;
    FIREBASE_PRIVATE_KEY: string | null;
}

@Injectable()
export class FirebaseEnvironmentConfig implements IFirebaseEnvironmentConfig {
    APP_ENV: string = '';
    FIREBASE_PRIVATE_KEY_ID: string | null = null;
    FIREBASE_PRIVATE_KEY: string | null = null;
}

export const FirebaseConfigSchema = zod.object({
    type: zod.string(),
    project_id: zod.string(),
    client_email: zod.string().regex(REGEX.EMAIL).nullable(),
    client_id: zod.string(),
    auth_uri: zod.string(),
    token_uri: zod.string(),
    auth_provider_x509_cert_url: zod.string(),
    client_x509_cert_url: zod.string(),
    universe_domain: zod.string(),
    privateKeyId: zod.string().nullable(),
    privateKey: zod.string().nullable(),
}) satisfies zod.ZodType<FirebaseJsonConfig>;

export const FirebaseEnvironmentConfigSchema = zod.object({
    ...EnvironmentConfigSchema.shape,
    FIREBASE_PRIVATE_KEY_ID: zod.string().nonempty(),
    FIREBASE_PRIVATE_KEY: zod.string().nonempty(),
}) satisfies zod.ZodType<FirebaseEnvironmentConfig>;

export class FirebaseConfig extends FileAndEnvConfig<
    FirebaseJsonConfig,
    FirebaseEnvironmentConfig
> {}

export class FirebaseConfigLoader extends JsonAndEnvConfigLoader<
    FirebaseJsonConfig,
    FirebaseEnvironmentConfig
> {
    constructor(configFileDirectory: string) {
        super(
            new JsonConfigLoader<FirebaseJsonConfig>(
                FIREBASE_CONFIG_KEY,
                new ZodSchema(FirebaseConfigSchema),
                configFileDirectory,
            ),
            new EnvConfigLoader<FirebaseEnvironmentConfig>(
                new ZodSchema(FirebaseEnvironmentConfigSchema),
            ),
        );
    }
}

export const FirebaseConfigProvider: Provider = {
    provide: FirebaseConfig,
    useFactory: async (): Promise<FirebaseConfig> => {
        const configLoader = new FirebaseConfigLoader(
            path.join(__dirname, '..'),
        );
        const config = await configLoader.load();
        if (config.err) {
            throw config.val;
        }
        return config.val;
    },
};
