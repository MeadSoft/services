import z, { ZodSafeParseResult, ZodType } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { EMPTY_LENGTH, ICrudService } from '@meadsoft/common';
import { ISeedData, ISeed, SeedSchema } from '../contracts/index';

export type ISeedConfig = {
    tableName: string;
    crudService: ICrudService<unknown, unknown>;
    schema: ZodType;
};

function hasJsonSchema(seedData: ISeedData): boolean {
    return seedData.jsonSchema !== undefined;
}

async function seed(
    crudService: ICrudService<unknown, unknown>,
    seedData: ISeedData | undefined,
    schema?: z.ZodType,
) {
    if (seedData === undefined) {
        console.error('seed data is undefined. Aborting');
        return;
    }
    const numberOfExistingItems = await crudService.countRows();
    if (numberOfExistingItems > EMPTY_LENGTH) {
        console.log(
            'Seeding skipped: items already exist in the database table',
            seedData.tableName,
        );
        return;
    }
    const hasJsonSchema_ = hasJsonSchema(seedData);
    const hasProvidedSchema = schema !== undefined;
    if (!hasJsonSchema_ && !hasProvidedSchema) {
        console.error(
            `No JSON schema found in the seed data and no Zod schema was provided. Aborting seeding for table ${seedData.tableName}`,
        );
        return;
    }
    // TODO: figure out how to convert JSON schemas to zod schemas for validation
    schema ??= z.object({ todo: 1 });
    const parseResults: ZodSafeParseResult<unknown>[] = seedData.data.map(
        (item: unknown) => schema.safeParse(item),
    );
    const hasFailedParse = parseResults.some((result) => !result.success);
    if (hasFailedParse) {
        const errors = parseResults
            .filter((result) => !result.success)
            .map((result) => result.error.issues);
        console.error('Failed to parse some items');
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        console.error(JSON.stringify(errors, null, 2));
        throw new Error('Failed to parse some items');
    }
    const items = parseResults
        .filter((result) => result.success)
        .map((result) => result.data);
    console.log(`Seeding ${parseResults.length.toString()} items...`);
    const result = await crudService.seedMany(...items);

    if (result.ok) {
        console.log(`✓ Created: ${parseResults.length.toString()} items`);
    } else {
        console.error(
            `✗ Failed to create ${parseResults.length.toString()} items:`,
            result.val.message,
        );
    }
}

export async function seedFromFile(
    crudServices: ISeedConfig[],
    seedFilepath: string,
) {
    const resolvedSeedFilepath: string = path.resolve(seedFilepath);
    if (!fs.existsSync(resolvedSeedFilepath)) {
        console.log(`Seed file does not exist: ${resolvedSeedFilepath}`);
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const seedDataUnsafe = JSON.parse(
        fs.readFileSync(resolvedSeedFilepath, 'utf-8'),
    );
    const seedData: ISeed = SeedSchema.parse(seedDataUnsafe);

    for (const {
        tableName,
        crudService: commandService,
        schema,
    } of crudServices) {
        await seed(
            commandService,
            seedData.tables.find((table) => table.tableName === tableName),
            schema,
        );
    }
}
