import { loadConfig } from '@meadsoft/common-server';
import { Provider } from '@nestjs/common';
import zod from 'zod';
import path from 'path';

export const AUTH_CONFIG_KEY = 'auth';

export class AuthConfig {
    /** # secret value. store in .env not in json */
    jwtSecret: string;

    constructor(jwtSecret: string) {
        this.jwtSecret = jwtSecret;
    }
}

export class AuthEnvironmentConfig {
    APP_ENV: string;
    JWT_SECRET: string;

    constructor(APP_ENV: string, JWT_SECRET: string) {
        this.APP_ENV = APP_ENV;
        this.JWT_SECRET = JWT_SECRET;
    }
}

export const AuthConfigSchema = zod.object({
    jwtSecret: zod.string().min(1),
}) satisfies zod.ZodType<AuthConfig>;

export const AuthEnvironmentConfigSchema = zod.object({
    APP_ENV: zod.string().nonempty(),
    JWT_SECRET: zod.string().min(1),
}) satisfies zod.ZodType<AuthEnvironmentConfig>;

export const AuthConfigProvider: Provider = {
    provide: AuthConfig,
    useFactory: async (): Promise<AuthConfig> => {
        const configDirectory = path.join(__dirname, '..');
        const settings = await loadConfig<AuthConfig, AuthEnvironmentConfig>(
            configDirectory,
            AUTH_CONFIG_KEY,
            undefined,
            AuthEnvironmentConfigSchema,
        );
        const { config, env } = settings;
        if (!env.JWT_SECRET) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables',
            );
        }
        const finalConfig: AuthConfig = {
            ...config,
            jwtSecret: env.JWT_SECRET,
        };
        return finalConfig;
    },
};
