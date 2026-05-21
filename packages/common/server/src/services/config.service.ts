import { accessSync, readFileSync } from 'fs';
import path, { join } from 'path';
import { readFile, access } from 'fs/promises';
import { Result, Err, Ok } from 'ts-results';
import * as dotenv from 'dotenv';
import zod from 'zod';
import {
    APP_ENV_SCHEMA,
    getAppEnv,
    ISchema,
    IBaseEnvConfig,
    IConfigLoader,
} from '@meadsoft/common';

export const CONFIG_PATH_TOKEN = Symbol('CONFIG_PATH_TOKEN');
export const DEFAULT_CONFIG_FILENAME_SCHEME = 'config.{env}.json';

class ZodBackedSchema<TConfig extends object> implements ISchema<TConfig> {
    constructor(private readonly schema: zod.ZodType<TConfig>) {}

    parse(data: unknown): Result<TConfig, zod.ZodError> {
        const result = this.schema.safeParse(data);
        return result.success ? Ok(result.data) : Err(result.error);
    }
}

class PassthroughSchema<TConfig extends object> implements ISchema<TConfig> {
    parse(data: unknown): Result<TConfig, zod.ZodError> {
        return Ok(data as TConfig);
    }
}

export const DEFAULT_CONFIG_SCHEMA = zod.object().extend(APP_ENV_SCHEMA.shape);

function getConfigPath(
    configDirectory: string,
    configFilenameScheme: string,
    appEnv: string,
): string {
    const configFile = configFilenameScheme.replace('{env}', appEnv);
    return join(configDirectory, configFile);
}

function getJsonConfigFromFile(
    fileContents: string,
    key: string | null,
): object | null | undefined {
    let jsonConfig: object | null | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedJson: Record<string, object> | undefined =
        JSON.parse(fileContents);
    if (key === null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        jsonConfig = JSON.parse(fileContents);
    } else {
        jsonConfig = parsedJson?.[key];
    }
    return jsonConfig;
}

function ensureSchema<TConfig extends object>(
    schema: ISchema<TConfig> | zod.ZodType<TConfig>,
): ISchema<TConfig> {
    if ('safeParse' in schema) {
        return new ZodBackedSchema(schema);
    }
    return schema;
}

export interface IFileAndEnvConfig<
    TFileConfig extends object,
    TEnvConfig extends IBaseEnvConfig,
> {
    file: TFileConfig;
    env: TEnvConfig;
}

export class FileAndEnvConfig<
    TFileConfig extends object,
    TEnvConfig extends IBaseEnvConfig,
> implements IFileAndEnvConfig<TFileConfig, TEnvConfig> {
    constructor(
        public readonly configLoader: JsonAndEnvConfigLoader<
            TFileConfig,
            TEnvConfig
        >,
        public readonly file: TFileConfig,
        public readonly env: TEnvConfig,
    ) {}

    logEnv(): void {
        Object.keys(this.env).forEach((key) => {
            console.log(`Environment variable ${key} loaded`);
        });
    }

    logConfig(): void {
        console.log(
            `File Config${this.configLoader.jsonConfigLoader.key !== null ? ' for ' + this.configLoader.jsonConfigLoader.key : ''}`,
        );
        console.log(this.file);
    }
}

/**
 * A configuration object that holds both file-based and environment-based configurations
 */
export class JsonAndEnvConfigLoader<
    TJsonConfig extends object,
    TEnvConfig extends IBaseEnvConfig,
> implements IConfigLoader<FileAndEnvConfig<TJsonConfig, TEnvConfig>> {
    constructor(
        public readonly jsonConfigLoader: JsonConfigLoader<TJsonConfig>,
        public readonly envConfigLoader: EnvConfigLoader<TEnvConfig>,
    ) {}

    async load(): Promise<
        Result<FileAndEnvConfig<TJsonConfig, TEnvConfig>, Error>
    > {
        const jsonResult = await this.jsonConfigLoader.load();
        if (jsonResult.err) {
            return Err(jsonResult.val);
        }
        const envResult = await this.envConfigLoader.load();
        if (envResult.err) {
            return Err(envResult.val);
        }
        return Ok(new FileAndEnvConfig(this, jsonResult.val, envResult.val));
    }

    loadSync(): Result<FileAndEnvConfig<TJsonConfig, TEnvConfig>, Error> {
        const jsonResult = this.jsonConfigLoader.loadSync();
        if (jsonResult.err) {
            return Err(jsonResult.val);
        }
        const envResult = this.envConfigLoader.loadSync();
        if (envResult.err) {
            return Err(envResult.val);
        }
        return Ok(new FileAndEnvConfig(this, jsonResult.val, envResult.val));
    }
}

export class JsonConfigLoader<
    TJsonConfig extends object,
> implements IConfigLoader<TJsonConfig> {
    private static loggedJsonConfigFile = false;

    constructor(
        public readonly key: string | null,
        public readonly fileSchema: ISchema<TJsonConfig>,
        public readonly configFileDirectory: string,
        public readonly configFilenameScheme: string = DEFAULT_CONFIG_FILENAME_SCHEME,
    ) {}

    async load(): Promise<Result<TJsonConfig, Error>> {
        const appEnvResult = getAppEnv();
        if (appEnvResult.err) {
            return Err(appEnvResult.val);
        }
        const appEnv = appEnvResult.val;
        const configPath = getConfigPath(
            this.configFileDirectory,
            this.configFilenameScheme,
            appEnv,
        );
        await access(configPath);
        const fileContent = await readFile(configPath, 'utf-8');
        if (!JsonConfigLoader.loggedJsonConfigFile) {
            console.log('Loaded Config JSON File', fileContent);
            JsonConfigLoader.loggedJsonConfigFile = true;
        }
        console.log(`Parsing JSON config for ${this.key ?? 'root'}`);
        const jsonConfig = getJsonConfigFromFile(fileContent, this.key);
        if (jsonConfig === undefined) {
            return Err(
                new Error(
                    `Key '${this.key ?? 'root'}' not found in JSON config file`,
                ),
            );
        }
        return this.fileSchema.parse(jsonConfig);
    }

    loadSync(): Result<TJsonConfig, Error> {
        const appEnvResult = getAppEnv();
        if (appEnvResult.err) {
            return Err(appEnvResult.val);
        }
        const appEnv = appEnvResult.val;
        const configPath = getConfigPath(
            this.configFileDirectory,
            this.configFilenameScheme,
            appEnv,
        );
        accessSync(configPath);
        const fileContent = readFileSync(configPath, 'utf-8');
        if (!JsonConfigLoader.loggedJsonConfigFile) {
            console.log('Loaded Config JSON File', fileContent);
            JsonConfigLoader.loggedJsonConfigFile = true;
        }
        console.log(`Parsing JSON config for ${this.key ?? 'root'}`);
        const jsonConfig = getJsonConfigFromFile(fileContent, this.key);
        if (jsonConfig === undefined) {
            return Err(
                new Error(
                    `Key '${this.key ?? 'root'}' not found in JSON config file`,
                ),
            );
        }
        return this.fileSchema.parse(jsonConfig);
    }
}

export class EnvConfigLoader<
    TEnvConfig extends IBaseEnvConfig,
> implements IConfigLoader<TEnvConfig> {
    constructor(public readonly envSchema: ISchema<TEnvConfig>) {}

    async load(envFilepath?: string): Promise<Result<TEnvConfig, Error>> {
        return await Promise.resolve(this.loadSync(envFilepath));
    }

    loadSync(envFilepath?: string): Result<TEnvConfig, Error> {
        const appEnv = getAppEnv();
        if (appEnv.err) {
            return Err(appEnv.val);
        }
        console.log(`APP_ENV = ${appEnv.val}`);
        const envFile = `.env.${appEnv.val}`;
        if (envFilepath === undefined) {
            const directoryPath = path.resolve(process.cwd());
            envFilepath = path.resolve(directoryPath, envFile);
        }
        dotenv.config({ path: envFilepath, override: true });
        const env = this.envSchema.parse(process.env);
        return env;
    }
}

export async function loadConfig<
    TJsonConfig extends object,
    TEnvConfig extends IBaseEnvConfig,
>(
    configDirectory: string,
    key: string | null,
    fileSchema?: ISchema<TJsonConfig> | zod.ZodType<TJsonConfig>,
    envSchema?: ISchema<TEnvConfig> | zod.ZodType<TEnvConfig>,
    configFilenameScheme: string = DEFAULT_CONFIG_FILENAME_SCHEME,
): Promise<{ config: TJsonConfig; env: TEnvConfig }> {
    const jsonConfigLoader = new JsonConfigLoader<TJsonConfig>(
        key,
        fileSchema === undefined
            ? new PassthroughSchema<TJsonConfig>()
            : ensureSchema(fileSchema),
        configDirectory,
        configFilenameScheme,
    );
    const envConfigLoader = new EnvConfigLoader<TEnvConfig>(
        envSchema === undefined
            ? new PassthroughSchema<TEnvConfig>()
            : ensureSchema(envSchema),
    );
    const settings = await new JsonAndEnvConfigLoader(
        jsonConfigLoader,
        envConfigLoader,
    ).load();
    if (settings.err) {
        throw settings.val;
    }
    return {
        config: settings.val.file,
        env: settings.val.env,
    };
}

export function createJsonAndEnvConfigLoader<
    TJsonConfig extends object,
    TEnvConfig extends IBaseEnvConfig,
>(
    key: string | null,
    fileSchema: ISchema<TJsonConfig>,
    configFileDirectory: string,
    configFilenameScheme: string = DEFAULT_CONFIG_FILENAME_SCHEME,
): {
    jsonConfigLoader: JsonConfigLoader<TJsonConfig>;
    envConfigLoader: EnvConfigLoader<TEnvConfig>;
} {
    const jsonConfigLoader = new JsonConfigLoader(
        key,
        fileSchema,
        configFileDirectory,
        configFilenameScheme,
    );
    const envConfigLoader = new EnvConfigLoader<TEnvConfig>(
        new PassthroughSchema<TEnvConfig>(),
    );
    return {
        jsonConfigLoader,
        envConfigLoader,
    };
}

export async function load<T extends object>(
    configLoader: IConfigLoader<T>,
): Promise<T> {
    const config = await configLoader.load();
    if (config.err) {
        throw config.val;
    }
    return config.val;
}

export function createConfigProvider<TConfig extends object>(
    configClass: new () => TConfig,
    configLoaderClass: new (
        configFileDirectory: string,
    ) => IConfigLoader<TConfig>,
) {
    return {
        provide: configClass,
        useFactory: async (configFileDirectory: string): Promise<unknown> => {
            const configLoader = new configLoaderClass(configFileDirectory);
            const config = await configLoader.load();
            if (config.err) {
                throw config.val;
            }
            return config.val;
        },
        inject: [CONFIG_PATH_TOKEN],
    };
}

export function createConfigProviderSync<TConfig extends object>(
    configClass: new () => TConfig,
    configLoaderClass: new (
        configFileDirectory: string,
    ) => IConfigLoader<TConfig>,
) {
    return {
        provide: configClass,
        useFactory: (configFileDirectory: string): unknown => {
            const configLoader = new configLoaderClass(configFileDirectory);
            const config = configLoader.loadSync();
            if (config.err) {
                throw config.val;
            }
            return config.val;
        },
        inject: [CONFIG_PATH_TOKEN],
    };
}
