---
name: create-infrastructure-from-contracts
description: "Generate infrastructure code (Drizzle ORM tables, repositories, domain entities, services, controllers) from Zod contract schemas. Use when: creating server-side infrastructure from a contracts package, scaffolding tables/repos/entities/services/controllers."
---

# Create Infrastructure from Contracts

Generate infrastructure code for a NestJS server package based on Zod contract schemas defined in a contracts package. The service the package is for is the name of the folder the contracts are in, e.g. `iam` for `packages/iam/contracts`.

## Prerequisites

Before generating, read and understand:

1. The data model architectural specs found in the `docs/specs/data-models.md` file
2. The contract schema files in the contracts package `src/` folder
3. The existing infrastructure code in the target server package (to match established patterns)
4. The database schema file (`*.db-schema.ts`) that defines the `pgSchema` for the target

## Contract Schema Structure

Each contract schema file (`{entity}.schema.ts`) exports:

| Export                                  | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| `New{Entity}Schema`                     | Zod object for creation input (no id, no audit fields)       |
| `{Entity}Schema`                        | `EntitySchema.extend(New{Entity}Schema.shape)` — full entity |
| `INew{Entity}`                          | `zod.infer<typeof New{Entity}Schema>`                        |
| `I{Entity}`                             | `zod.infer<typeof {Entity}Schema>`                           |
| `{Entity}` class                        | Implements `I{Entity}` with constructor                      |
| `{ENTITY}_RESOURCE_NAME`                | URL path segment constant                                    |
| Optional: defaults                      | e.g. `MENU_ITEM_IS_ACTIVE_DEFAULT`                           |
| Optional: `{Entity}WithRelationsSchema` | Schema including nested related entities                     |

`EntitySchema` from `@meadsoft/common` provides: `id` (uuid), `createdDate`, `updatedDate`, `createdById`, `updatedById`.

## Generation Steps

### Step 1: Drizzle ORM Table

**File:** `src/database/tables/{entity-plural}.table.ts`

**Template:**

```typescript
import { varchar, text, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { entityColumns } from '@meadsoft/common-infrastructure';
import { /* defaults if any */ } from '@meadsoft/{contracts-package}';
import { dbSchema } from './{db-schema-file}';

export const {ENTITY_PLURAL}_TABLE_NAME = '{entity_plural_snake}';

export const {entityPlural}Table = dbSchema.table(
    {ENTITY_PLURAL}_TABLE_NAME,
    {
        ...entityColumns,
        // Map each New{Entity}Schema field:
        // zod.string()                    → varchar({ length: 255 }).notNull()
        // zod.string().nullable()         → varchar({ length: 255 })
        // zod.string() (long text)        → text()
        // zod.number()                    → decimal<'number'>({ precision: 10, scale: 2, mode: 'number' })
        // zod.boolean().default(DEFAULT)  → boolean().default(DEFAULT).notNull()
        // zod.uuidv7() (FK)        → uuid().references(() => otherTable.id)
    },
);

// Only if this entity has relations (foreign keys or many-to-many):
export const {entityPlural}Relations = relations({entityPlural}Table, ({ one, many }) => ({
    // one: ({ one }) => one(otherTable, { fields: [thisTable.fkId], references: [otherTable.id] })
    // many: ({ many }) => many(junctionTable)
}));
```

**Column mapping rules:**

| Zod Type                                | Drizzle Column                                                   |
| --------------------------------------- | ---------------------------------------------------------------- |
| `zod.string().nonempty().max(N)`        | `varchar({ length: N }).notNull()`                               |
| `zod.string().nullable().default(null)` | `varchar({ length: 255 })`                                       |
| `zod.string()` (URL/long)               | `varchar({ length: 512 })` or `text()`                           |
| `zod.number().nullable().default(null)` | `decimal<'number'>({ precision: 10, scale: 2, mode: 'number' })` |
| `zod.boolean().default(VAL)`            | `boolean().default(VAL).notNull()`                               |
| `zod.uuidv7()` (FK)                     | `uuid().references(() => otherTable.id)`                         |

### Step 2: Infrastructure Specific Services

**Files:** `src/database/infrastructure/{service}-database.service.ts`

**Template:**

```typescript
import { Injectable } from "@nestjs/common";
import { InfrastructureConfig, PostgresDbService, PostgresUnitOfWork } from "@meadsoft/common-infrastructure";
import { {service-lowercase}DrizzlePgSchema } from "./tables/drizzle-schema";
import type { I{Service}DrizzlePgSchema } from "./tables/drizzle-schema";

@Injectable()
export class {Service}DbService extends PostgresDbService<I{Service}DrizzlePgSchema> {
    constructor(infrastructureConfig: InfrastructureConfig) {
        super({service-lowercase}DrizzlePgSchema, infrastructureConfig);
    }
}

@Injectable()
export class {Service}UnitOfWork extends PostgresUnitOfWork<I{Service}DrizzlePgSchema> {
    constructor(databaseService: {Service}DbService) {
        super(databaseService);
    }
}
```

### Step 3: Repositories

**File:** `src/database/repositories/{entity-plural}.repo.ts`

**Template (simple entity):**

```typescript
import { Injectable } from '@nestjs/common';
import {
    DrizzlePgCommandRepository,
    DrizzlePgFilterTranslationService,
} from '@meadsoft/common-infrastructure';
import { I{Entity}, {Entity}Schema } from '@meadsoft/{contracts-package}';
import { {entityPlural}Table } from '../tables/{entity-plural}.table';
import { {Service}UnitOfWork } from '../infrastructure/{service}-database.service';
import { ZodSchema } from '@meadsoft/common-server';
import { eq } from 'drizzle-orm';

@Injectable()
export class {EntityPlural}Repository extends DrizzlePgCommandRepository<I{Entity}, string, {Service}DrizzlePgSchema> {
    constructor(
        protected override unitOfWork: {Service}UnitOfWork,
        filterTranslationService: DrizzlePgFilterTranslationService,
    ) {
        super(
            {entityPlural}Table,
            new ZodSchema({Entity}Schema),
            unitOfWork,
            filterTranslationService,
        );
    }

    override equals(id: string) {
        return eq({entityPlural}Table.id, id);
    }
}
```

**Template (entity with relations):** Add `findOneWithRelations` and `findManyWithRelations` methods that use `database.query.{table}.findMany({ with: { ... } })` and map junction table results. Follow the pattern in existing relation-aware repositories.

### Step 4: Domain Entity

**File:** `src/domain/{entity-singular}.entity.ts`

**Template:**

```typescript
import { Err, Ok, Result } from 'ts-results';
import { EMPTY_LENGTH, Entity } from '@meadsoft/common-server';
import { EntityService } from '@meadsoft/common-nestjs';
import {
    INew{Entity},
    I{Entity},
} from '@meadsoft/{contracts-package}';

export class {Entity}Entity extends Entity implements I{Entity} {
    // Declare each non-audit property from the contract:
    public propertyName!: PropertyType;

    public static create(
        userId: string,
        new{Entity}: INew{Entity},
        entityService: EntityService,
    ): Result<{Entity}Entity, Error> {
        const entity = new {Entity}Entity();

        // Add validation rules for required fields:
        // if (!new{Entity}.name || new{Entity}.name.trim().length === EMPTY_LENGTH) {
        //     return Err(new Error('{Entity} name cannot be empty'));
        // }

        entityService.initialize(userId, entity);
        // Assign each property from new{Entity}:
        // entity.propertyName = new{Entity}.propertyName;
        return Ok(entity);
    }

    public static reconstitute(data: I{Entity}): Result<{Entity}Entity, Error> {
        const entity = new {Entity}Entity();
        Object.assign(entity, data);
        return Ok(entity);
    }

    toDTO(): I{Entity} {
        return {
            id: this.id,
            // ...each property
            createdDate: this.createdDate,
            updatedDate: this.updatedDate,
            createdById: this.createdById,
            updatedById: this.updatedById,
        };
    }
}
```

**Note:** For complex entities (with domain events, AggregateRoot), extend `AggregateRoot` from `@meadsoft/common-application` instead of `Entity`.

### Step 5: Services

**File:** `src/services/{entity-plural or entity-singular}.service.ts`

Check existing service files in the target package for naming convention (singular vs plural).

**Template:**

```typescript
import { Injectable } from '@nestjs/common';
import { ChangeHistoryService, EntityService } from '@meadsoft/common-nestjs';
import { QueryService, CommandService } from '@meadsoft/common-application';
import { UnitOfWorkService } from '@meadsoft/common-infrastructure';
import { INew{Entity}, I{Entity} } from '@meadsoft/{contracts-package}';
import { {EntityPlural}Repository } from '../database/repositories';
import { {Entity}Entity } from '../domain/{entity-singular}.entity';

@Injectable()
export class {Entity}QueryService extends QueryService<I{Entity}> {
    constructor(repository: {EntityPlural}Repository) {
        super(repository);
    }
}

@Injectable()
export class {Entity}CommandService extends CommandService<INew{Entity}, I{Entity}> {
    constructor(
        repository: {EntityPlural}Repository,
        entityService: EntityService,
        unitOfWorkService: UnitOfWorkService,
        changeHistoryService: ChangeHistoryService,
    ) {
        super(
            repository,
            unitOfWorkService,
            entityService,
            changeHistoryService,
            (userId: string, newModel: INew{Entity}) =>
                {Entity}Entity.create(userId, newModel, entityService),
        );
    }
}
```

**For entities with relations:** Add custom methods (e.g., `findOneWithRelations`, `findManyWithRelations`) to the query service, delegating to the repository.

### Step 6: Controllers

**File:** `src/controllers/{entity-plural}.controller.ts`

**Template:**

```typescript
import { Controller } from '@nestjs/common';
import {
    INew{Entity},
    New{Entity}Schema,
    {Entity},
    {Entity}Schema,
    {ENTITY}_RESOURCE_NAME,
} from '@meadsoft/{contracts-package}';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    {Entity}CommandService,
    {Entity}QueryService,
} from '../services/{service-file-name}.service';
import { API_TAG } from './api-tags';

const {entityCamel}QueryController = createQueryController<{Entity}>({Entity});

const {entityCamel}CommandController = createCommandController<INew{Entity}, {Entity}>(
    {Entity},
    New{Entity}Schema,
    {Entity}Schema,
);

@ApiTags(API_TAG)
@Controller({ENTITY}_RESOURCE_NAME)
export class {EntityPlural}QueryController extends {entityCamel}QueryController {
    constructor(service: {Entity}QueryService) {
        super(service);
    }
}

@ApiTags(API_TAG)
@Controller({ENTITY}_RESOURCE_NAME)
export class {EntityPlural}CommandController extends {entityCamel}CommandController {
    constructor(service: {Entity}CommandService) {
        super(service);
    }
}
```

### Step 7: Update Aggregation Files

#### Drizzle Schema (`src/database/tables/drizzle-schema.ts`)

Add the new table and relations exports to the schema object and re-export:

```typescript
import { {entityPlural}Table, {entityPlural}Relations } from './{entity-plural}.table';

export const drizzleSchema = {
    // ...existing entries
    {entityPlural}Table,
    {entityPlural}Relations,
};
```

#### Repository Barrel (`src/database/repositories/index.ts`)

Re-export the new repository.

#### NestJS Modules

Create a query module and a command module. The query module should not import the command service or controller, but the command module should import the query service to use within command handlers.

Register:

- Repository as a provider
- Query service and command service as providers
- Query controller and command controller in the controllers array

## Naming Conventions

| Concept               | Convention                                                          | Example                    |
| --------------------- | ------------------------------------------------------------------- | -------------------------- |
| Contract schema file  | `{entity-singular}.schema.ts`                                       | `menu-item.schema.ts`      |
| Table file            | `{entity-plural}.table.ts`                                          | `menu-items.table.ts`      |
| Table export          | `{entityPlural}Table`                                               | `menuItemsTable`           |
| Table name (SQL)      | `{entity_plural_snake}`                                             | `menu_items`               |
| Relations export      | `{entityPlural}Relations`                                           | `menuItemsRelations`       |
| Repository file       | `{entity-plural}.repo.ts`                                           | `menu-items.repo.ts`       |
| Repository class      | `{Entity}Repository` or `{EntityPlural}Repository`                  | `MenuItemRepository`       |
| Domain entity file    | `{entity-singular}.entity.ts`                                       | `menu-item.entity.ts`      |
| Domain entity class   | `{Entity}Entity`                                                    | `MenuItemEntity`           |
| Service file          | `{entity-singular or plural}.service.ts`                            | `menu-item.service.ts`     |
| Query service class   | `{Entity}QueryService`                                              | `MenuItemQueryService`     |
| Command service class | `{Entity}CommandService`                                            | `MenuItemCommandService`   |
| Controller file       | `{entity-plural}.controller.ts`                                     | `menu-items.controller.ts` |
| Controller classes    | `{EntityPlural}QueryController` / `{EntityPlural}CommandController` | `MenuItemsQueryController` |

**Important:** Check the target server package for established naming patterns. Some packages use singular service filenames (`menu-item.service.ts`) while others use plural (`sizes.service.ts`). Match what already exists.

## Package Imports Reference

| Import                                                                                                                        | Package                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `EntitySchema`, `IEntity`, `DEFAULT_STRING_LENGTH`                                                                            | `@meadsoft/common`                    |
| `entityColumns`, `DrizzlePgCommandRepository`, `DrizzlePgFilterTranslationService`, `PostgresUnitOfWork`, `UnitOfWorkService` | `@meadsoft/common-infrastructure`     |
| `ZodSchema`, `Entity`, `EMPTY_LENGTH`, `IFilter`, `FIRST_INDEX`                                                               | `@meadsoft/common-server`             |
| `EntityService`, `ChangeHistoryService`                                                                                       | `@meadsoft/common-nestjs`             |
| `QueryService`, `CommandService`, `AggregateRoot`                                                                             | `@meadsoft/common-application`        |
| `createQueryController`, `createCommandController`                                                                            | `@meadsoft/common-http-server-nestjs` |
| `varchar`, `text`, `decimal`, `boolean`, `uuid`, `pgSchema`                                                                   | `drizzle-orm/pg-core`                 |
| `relations`, `eq`                                                                                                             | `drizzle-orm`                         |
| `Injectable`, `Controller`, `Get`, `Post`, `Param`                                                                            | `@nestjs/common`                      |
| `ApiTags`, `ApiOkResponse`                                                                                                    | `@nestjs/swagger`                     |
| `Ok`, `Err`, `Result`                                                                                                         | `ts-results`                          |
