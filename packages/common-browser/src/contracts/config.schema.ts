import { Result } from 'ts-results';
import zod from 'zod';

export const EnvironmentConfigSchema = zod.object({
    APP_ENV: zod.string().nonempty(),
});
export type IBaseEnvConfig = zod.infer<typeof EnvironmentConfigSchema>;
export interface IConfigLoader<TConfig extends object> {
    load(): Promise<Result<TConfig, Error>>;
    loadSync(): Result<TConfig, Error>;
}
