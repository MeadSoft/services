import { BadRequestException } from '@nestjs/common';
import { ZodSafeParseResult } from 'zod';

export class InvalidIDException extends BadRequestException {
    constructor() {
        super('Invalid ID');
    }
}

export class SchemaValidationException extends BadRequestException {
    constructor(safeParseResult: ZodSafeParseResult<unknown>) {
        // assume safeParseResult is a failure. it is desirable to error here if it is not.
        // so non-failing parse results cause an internal error if passed to this constructor
        super(safeParseResult.error?.issues);
    }
}
