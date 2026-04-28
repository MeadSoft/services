import { EnvironmentConfigSchema, ZodSchema } from '@meadsoft/common';
import { EnvConfigLoader } from '@meadsoft/common-server';
import { Provider } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import zod from 'zod';

export const InfrastructureEnvironmentConfigSchema = zod.object({
    ...EnvironmentConfigSchema.shape,
    DATABASE_URL: zod.string().nonempty(),
});
export type InfrastructureEnvironmentConfig = zod.infer<
    typeof InfrastructureEnvironmentConfigSchema
>;
export class InfrastructureConfig extends createZodDto(
    InfrastructureEnvironmentConfigSchema,
) {}

export class InfrastructureConfigLoader extends EnvConfigLoader<InfrastructureEnvironmentConfig> {
    constructor() {
        super(new ZodSchema(InfrastructureEnvironmentConfigSchema));
    }
}

export const InfrastructureProvider: Provider = {
    provide: InfrastructureConfig,
    useFactory: async (): Promise<InfrastructureConfig> => {
        const configLoader = new InfrastructureConfigLoader();
        const config = await configLoader.load();
        if (config.err) {
            throw config.val;
        }
        return config.val;
    },
};
