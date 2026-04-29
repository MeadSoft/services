import { FIRST_INDEX, ZodSchema } from '@meadsoft/common';
import {
    CONFIG_PATH_TOKEN,
    JsonConfigLoader,
    createConfigProvider,
} from '@meadsoft/common-server';
import { Inject, Provider } from '@nestjs/common';
import zod from 'zod';

export const HTTP_CONFIG_KEY = 'http';
export const MINIMUM_PORT = 1;
export const MAXIMUM_PORT = 65535;
export const HttpJsonConfigSchema = zod.object({
    port: zod.number().min(MINIMUM_PORT).max(MAXIMUM_PORT),
});
export const HttpEnvConfigSchema = zod.object();
export type IHttpJsonConfig = zod.infer<typeof HttpJsonConfigSchema>;
export type IHttpEnvConfig = zod.infer<typeof HttpEnvConfigSchema>;
export class HttpConfig implements IHttpJsonConfig {
    port = FIRST_INDEX;
}

export class HttpConfigLoader extends JsonConfigLoader<HttpConfig> {
    constructor(@Inject(CONFIG_PATH_TOKEN) configFileDirectory: string) {
        super('http', new ZodSchema(HttpJsonConfigSchema), configFileDirectory);
    }
}

export const HttpConfigProvider: Provider = createConfigProvider(
    HttpConfig,
    HttpConfigLoader,
);
