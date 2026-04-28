import {
    CONFIG_PATH_TOKEN,
    createConfigProvider,
    createJsonAndEnvConfigLoader,
    JsonAndEnvConfigLoader,
} from '@meadsoft/common-server';
import { ZodSchema } from '@meadsoft/common';
import {
    IAM_CONFIG_KEY,
    IamConfig,
    IamConfigJsonSchema,
    IIamEnvConfig,
    IIamJsonConfig,
} from './iam.config';
import { Inject, Provider } from '@nestjs/common';

export class IamConfigLoader extends JsonAndEnvConfigLoader<
    IIamJsonConfig,
    IIamEnvConfig
> {
    constructor(@Inject(CONFIG_PATH_TOKEN) configFileDirectory: string) {
        const { jsonConfigLoader, envConfigLoader } =
            createJsonAndEnvConfigLoader<IIamJsonConfig, IIamEnvConfig>(
                IAM_CONFIG_KEY,
                new ZodSchema(IamConfigJsonSchema),
                configFileDirectory,
            );
        super(jsonConfigLoader, envConfigLoader);
    }
}

export const IamConfigProvider: Provider = createConfigProvider(
    IamConfig,
    IamConfigLoader,
);
