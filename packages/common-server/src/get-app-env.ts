import { Err, Ok, Result } from 'ts-results';
import { Environment } from './contracts/environment.enum';
import zod from 'zod';

export const APP_ENV_SCHEMA = zod.object({
    APP_ENV: zod.string().nonempty(),
});
export const DEFAULT_APP_ENV_KEY = 'APP_ENV';
export const DEFAULT_ENVIRONMENT = Environment.prod;

export function getAppEnv(appEnvKey?: string): Result<Environment, Error> {
    appEnvKey ??= DEFAULT_APP_ENV_KEY;
    const env = process.env[appEnvKey];
    const matchingEnv = Object.values(Environment).find((e) => e === env);
    if (matchingEnv === undefined) {
        return Err(new Error(`Invalid environment: ${env ?? 'undefined'}`));
    }
    return Ok(matchingEnv);
}
