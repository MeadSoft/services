import { Err, Ok, Result } from 'ts-results';
import zod from 'zod';

export interface ISchema<T = unknown> {
    parse(data: unknown): Result<T, zod.ZodError>;
}

export class ZodSchema<T = unknown> implements ISchema<T> {
    constructor(private readonly zodSchema: zod.ZodType<T>) {}

    parse(data: unknown): Result<T, zod.ZodError> {
        const result = this.zodSchema.safeParse(data);
        return result.success ? Ok(result.data) : Err(result.error);
    }
}

export function parseResult<TModel>(
    item: unknown,
    schema: ISchema<TModel>,
): TModel {
    const result = schema.parse(item);
    if (result.err) {
        throw result.val;
    }
    return result.val;
}

export function parseResults<TModel>(
    items: unknown[],
    schema: ISchema<TModel>,
): TModel[] {
    return items.map((item) => parseResult(item, schema));
}
