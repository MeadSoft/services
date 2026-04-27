---
name: "Create Infrastructure from Contracts"
description: "Generate infrastructure code (Drizzle ORM tables, repositories, domain entities, services, and controllers) from an existing API contracts package. Use when: scaffolding server-side infrastructure for a contracts folder, creating tables/repos/entities/services/controllers from Zod schemas."
argument-hint: "contracts package path and target server package path, e.g. packages/restaurant-catalog-contracts packages/restaurant-catalog-server-nestjs"
agent: "agent"
tools: ["search/codebase", "edit/editFiles", "vscode/askQuestions"]
---

Read the skill file for full implementation details:

- [SKILL.md](../skills/create-infrastructure-from-contracts/SKILL.md)

Generate infrastructure code for a NestJS server package based on the Zod contract schemas in a contracts package.

## Inputs

1. **Contracts package path** (required): Path to the contracts package containing Zod schema files (e.g., `packages/restaurant-catalog-contracts`).
2. **Target server package path** (required): Path to the server package where infrastructure code will be generated (e.g., `packages/restaurant-catalog-server-nestjs`).
3. **Entity names** (optional): Specific entity schema files to generate for. If omitted, generate for all `*.schema.ts` files in the contracts `src/` folder.

## Task

For each contract schema file, generate these infrastructure artifacts in the target server package:

1. **Drizzle ORM table** → `src/database/tables/{entity-plural}.table.ts`
2. **Repository** → `src/database/repositories/{entity-plural}.repo.ts`
3. **Domain entity** → `src/domain/{entity-singular}.entity.ts`
4. **Query + Command services** → `src/services/{entity-plural or entity-singular}.service.ts`
5. **Query + Command controllers** → `src/controllers/{entity-plural}.controller.ts`

Then update aggregation files:

6. **Drizzle schema** → `src/database/tables/drizzle-schema.ts` (add table + relations exports)
7. **Repository barrel** → `src/database/repositories/index.ts` (re-export new repo)
8. **NestJS module** → register new providers (repo, services) and controllers

## Constraints

- Follow existing patterns in the target server package exactly.
- Use the SKILL.md reference for exact templates and import paths.
- Do not modify contract files.
- Do not create files that already exist; update them instead.
- Match the naming conventions already established in the target package.
