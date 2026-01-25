# Architecture Overview

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

This document, and its subdocuments, serve as a critical, living template designed to equip **people** and AI agents with a rapid and comprehensive understanding of the codebase's architecture. Enabling efficient navigation and effective contribution from day one. Update this document as the codebase evolves.

Values found between curly brackets `{variable}` are to be considered as variable placeholders and their actual value should be considered relative to the context in which they are found or used.

## Tags

- `ui`: A user interface
- `server`: server oriented functionality
- `client`: client oriented functionality
- `util`: Code that provides functions that do not depend on external state or applications
- `query`: read only functionality
- `command` : create, update, and delete functionality
- `model`: a data model/contract. No behavioral logic
- `domain`: a business domain

## Global Requirements

- All applications and packages MUST follow a modular architecture, with each module encapsulating a specific functionality or feature.
    - Each file SHOULD encapsulate a single responsibility. This means each file should only contain code related to a single concept or functionality.
- All applications, packages, and systems MUST include a `README.md` file
- All applications, packages, and systems MUST include this information at the top of their `README.md` file in their root directory containing the following information:
    - Owner(s): {Insert Lead Developer/Team Name}
    - Status: {Active | Maintenance | Proof of Concept | Deprecated}
    - Documentation: {Insert Link to Relevant Documentation Server} _OPTIONAL_

### AI Generated Code Requirements

**A computer can NEVER be held accountable. Therefore, all AI generated code MUST be reviewed by a human before being merged or deployed.**

- AI generated code MUST be prefixed with a comment that states it is AI generated code. This does NOT remove the responsibility of human review. It's intention is to simply make identifying AI slop easier.
    - The comment MUST include the name of the AI model
    - The comment MUST include the prompt used to generate the code. The prompt SHALL be truncated if it exceeds 1000 characters. This limit is arbitrary
    - The comment MUST be placed at the top of each generated block. A block of code can be defined as a function, a class, or an entire file
    - The AI generated code comment SHOULD follow a format similar to the one below:

```ts
// AI Generated ({model used})
// Prompt: {prompt used}
// Prompt Template: {prompt template title} (only needed if a template is used)
code here...
```

### App and Package Dependency Rules

Dependencies SHALL be managed through NX workspace configuration and MUST adhere to the following rules:

- An app or package MAY have multiple tags
- An app or package MUST have at least one tag
- An app or package MUST NOT have duplicate tags
- Tags MAY be one of the following defined in the [Tags](#tags) section below
- Tags MUST follow the following restrictions:
    - An app or package with the `ui` tag MUST NOT have the `server` tag
    - An app or package with the `server` tag MUST NOT have the `ui` or `client` tag
    - An app or package with the `query` tag MUST only depend on packages with the `model`, `util`, or other `query` tags

## Directory Structure

This section provides a high-level overview of the mono-repositories directories and file structure, categorised by architectural layer or major functional area. It is essential for quickly navigating the codebase, locating relevant files, and understanding the overall organization and separation of concerns.

- `packages/` See the [Package Specification](./packages/spec.md) below
- `apps/` See the [App Specification](./apps/spec.md)
- `systems/` See the [System Specification](./systems/spec.md) below
- `docs/` Project documentation (e.g., API docs, setup guides, specifications)
- `scripts/` Common mono-repository tasks (e.g., workspace environment setup, health checks)
- `tsconfig.base.json` Global TypeScript build configuration
- `tsconfig.json` Global TypeScript project references. Should also reference the base configuration
- `tsup.config.ts` Global TypeScript bundling configuration

## Development Environment

> TODO: add dev container stuff here when i actually finish setting it up

## Code Language Requirements

> TODO: add thoughts on organizing other languages here when theres other languages in the monorepo. As of 2026-01-25, all code in this repository is written in TypeScript.

### TypeScript / JavaScript

- VS Code SHOULD be used as the primary code editor for development.
- pnpm MUST be used as the package manager for the monorepo.
- JavaScript MUST NOT be used for any **new** code.
- TypeScript MUST be used to generate executable JavaScript code.
- ESLint MUST be used for linting the codebase, following the rules defined in the root of the monorepo.
- Node.js SHOULD be used as the runtime for server-side code.
- Zod SHOULD be used for schema validation and type inference.
- Jest SHOULD be used for unit testing the codebase.
- tsup SHOULD be used for building and bundling TypeScript projects within the monorepo. See the scripts folder for existing build and bundling scripts.

#### Look and Feel Requirements

- Typescript MUST use ES module importing and exporting
    - Imports MUST use relative paths from the src directory
- Prettier MUST be used for code formatting, following the configuration defined in the root of the monorepo.
- Code MUST adhere to the ESLint rules defined in the root of the monorepo
- Interfaces, types, and zod schemas MUST be placed in a file named similarly to `*.schema.ts`
    - Each interface, type, and zod schema MUST be exported from the module
- Services and utility functions related to filters MUST be placed in a file named similarly to `*.service.ts` or `*.util.ts`
    - Each service and utility function MUST be exported from the module
- Each folder MUST contain an `index.ts` file that exports all public classes, interfaces, types, functions, and constants from that folder.

## DevOps

### Monorepo Management and Build Orchestration

- NX MUST be used for monorepo management and build orchestration.

### CI/CD Requirements

- GitHub Actions MUST be used for continuous integration and continuous deployment (CI/CD) pipelines.
- Dockerfiles MUST be created for each application to ensure consistent deployment strategies across different environments.

## Glossary

### Acronyms

None yet

### Terms

- **Module**: A self-contained unit of code that encapsulates a specific functionality or feature within the codebase
- **Server**: Code that expects responses over a transport layer protocol to respond to client requests
- **Client**: Code that makes requests to a server over a transport layer protocol
- **Package**: A reusable library or module that encapsulates specific functionality or features
- **Application**: A single deployable unit that provides specific functionality or services
- **System**: A collection of applications that work together to provide a broader set of functionalities or services
