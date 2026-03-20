import path, { join } from 'path';
import { readFile, access } from 'fs/promises';
import { Result, Err, Ok } from 'ts-results';
import { accessSync, readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import zod from 'zod';
import { getAppEnv } from '../get-app-env';
import { ISchema } from '../validation/schema.model';
import { IBaseEnvConfig, IConfigLoader } from '../contracts/config.schema';

export const DEFAULT_CONFIG_FILENAME_SCHEME = 'config.{env}.json';

export function getConfigPath(
    configDirectory: string,
    configFilenameScheme: string,
    appEnv: string,
): string {
    const configFile = configFilenameScheme.replace('{env}', appEnv);
    return join(configDirectory, configFile);
}

export function getJsonConfigFromFile(
    fileContents: string,
    key: string | null,
): object {
    let jsonConfig: object;
    if (key === null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        jsonConfig = JSON.parse(fileContents);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        jsonConfig = JSON.parse(fileContents)[key];
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

export class FileAndEnvConfig<
    TFileConfig extends object,
    TEnvConfig extends IBaseEnvConfig,
> {
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
        const jsonConfig = getJsonConfigFromFile(fileContent, this.key);
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
        const jsonConfig = getJsonConfigFromFile(fileContent, this.key);
        return this.fileSchema.parse(jsonConfig);
    }
}

export class EnvConfigLoader<
    TEnvConfig extends IBaseEnvConfig,
> implements IConfigLoader<TEnvConfig> {
    constructor(public readonly envSchema: ISchema<TEnvConfig>) {}

    async load(): Promise<Result<TEnvConfig, Error>> {
        return await Promise.resolve(this.loadSync());
    }

    loadSync(): Result<TEnvConfig, Error> {
        const appEnv = getAppEnv();
        if (appEnv.err) {
            return Err(appEnv.val);
        }
        console.log(`APP_ENV = ${appEnv.val}`);
        const envFile = `.env.${appEnv.val}`;
        const directoryPath = path.resolve(process.cwd());
        const envFilePath = path.resolve(directoryPath, envFile);
        dotenv.config({ path: envFilePath, override: true });
        const env = this.envSchema.parse(process.env);
        return env;
    }
}
