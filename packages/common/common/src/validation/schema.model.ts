import { Err, Ok, Result } from 'ts-results';
import zod from 'zod';

export interface ISchema<T> {
    parse(data: unknown): Result<T, zod.ZodError>;
}

export class ZodSchema<T> implements ISchema<T> {
    constructor(private readonly zodSchema: zod.ZodType<T>) {}

    parse(data: unknown): Result<T, zod.ZodError> {
        const result = this.zodSchema.safeParse(data);
        return result.success ? Ok(result.data) : Err(result.error);
    }
}
