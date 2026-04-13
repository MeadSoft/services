import {
    CONFIG_PATH_TOKEN,
    createConfigProvider,
    createJsonAndEnvConfigLoader,
    DEFAULT_CONFIG_SCHEMA,
    IFileAndEnvConfig,
    JsonAndEnvConfigLoader,
    ZodSchema,
} from '@meadsoft/common-server';
import { Inject, Provider } from '@nestjs/common';
import zod from 'zod';

export const AUTH_CONFIG_KEY = 'auth';
export const AuthConfigJsonSchema = zod.any();
export const AuthConfigEnvSchema = zod
    .object({
        JWT_SECRET: zod.string().nonempty(),
    })
    .extend(DEFAULT_CONFIG_SCHEMA.shape);
export type IAuthJsonConfig = zod.infer<typeof AuthConfigJsonSchema>;
export type IAuthEnvConfig = zod.infer<typeof AuthConfigEnvSchema>;
export class AuthConfig implements IFileAndEnvConfig<
    IAuthJsonConfig,
    IAuthEnvConfig
> {
    file: IAuthJsonConfig;
    env: IAuthEnvConfig = { JWT_SECRET: '', APP_ENV: '' };
}

export class AuthConfigLoader extends JsonAndEnvConfigLoader<
    IAuthJsonConfig,
    IAuthEnvConfig
> {
    constructor(@Inject(CONFIG_PATH_TOKEN) configFileDirectory: string) {
        const { jsonConfigLoader, envConfigLoader } =
            createJsonAndEnvConfigLoader<IAuthJsonConfig, IAuthEnvConfig>(
                'auth',
                new ZodSchema(AuthConfigJsonSchema),
                configFileDirectory,
            );
        super(jsonConfigLoader, envConfigLoader);
    }
}

export const AuthConfigProvider: Provider = createConfigProvider(
    AuthConfig,
    AuthConfigLoader,
);
