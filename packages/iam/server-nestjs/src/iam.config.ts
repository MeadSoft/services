import {
    COOKIE_AUTH_MAX_AGE_MILLISECONDS_DEFAULT,
    COOKIE_AUTH_SAME_SITE_DEFAULT,
    COOKIE_AUTH_SECURE_DEFAULT,
} from '@meadsoft/iam-contracts';
import {
    DEFAULT_CONFIG_SCHEMA,
    IFileAndEnvConfig,
} from '@meadsoft/common-server';
import zod from 'zod';
import { CookieIamConfigJsonSchema } from './iam-cookie.config';

export const IAM_CONFIG_KEY = 'iam';
export const IamConfigJsonSchema = zod.object({
    cookie: CookieIamConfigJsonSchema,
});
export const IamConfigEnvSchema = zod
    .object({
        JWT_SECRET: zod.string().nonempty(),
    })
    .extend(DEFAULT_CONFIG_SCHEMA.shape);
export type IIamJsonConfig = zod.infer<typeof IamConfigJsonSchema>;
export type IIamEnvConfig = zod.infer<typeof IamConfigEnvSchema>;
export class IamConfig implements IFileAndEnvConfig<
    IIamJsonConfig,
    IIamEnvConfig
> {
    file: IIamJsonConfig = {
        cookie: {
            domain: undefined,
            sameSite: COOKIE_AUTH_SAME_SITE_DEFAULT,
            secure: COOKIE_AUTH_SECURE_DEFAULT,
            maxAge: COOKIE_AUTH_MAX_AGE_MILLISECONDS_DEFAULT,
        },
    };
    env: IIamEnvConfig = {
        APP_ENV: '',
        JWT_SECRET: '',
    };
}
