import { JsonConfigLoader, ZodSchema } from '@meadsoft/common-server';
import { Provider } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import zod from 'zod';
import path from 'path';

export const HTTP_CONFIG_KEY = 'http';
export const MINIMUM_PORT = 1;
export const MAXIMUM_PORT = 65535;

export const HttpConfigSchema = zod.object({
    port: zod.number().min(MINIMUM_PORT).max(MAXIMUM_PORT),
});

export class HttpConfig extends createZodDto(HttpConfigSchema) {}

export class HttpConfigLoader extends JsonConfigLoader<HttpConfig> {
    constructor(configFileDirectory: string) {
        super('http', new ZodSchema(HttpConfigSchema), configFileDirectory);
    }
}

export const HttpConfigProvider: Provider = {
    provide: HttpConfig,
    useFactory: async (): Promise<HttpConfig> => {
        const configLoader = new HttpConfigLoader(path.join(__dirname, '..'));
        const config = await configLoader.load();
        if (config.err) {
            throw config.val;
        }
        return config.val;
    },
};
