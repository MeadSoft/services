# Codebase Standards

## Toolings

### Code Standards

- VS Code SHOULD be used as the primary code editor for development.
- pnpm MUST be used as the package manager for the monorepo.
- NX MUST be used for monorepo management and build orchestration.
- tsup SHOULD be used for building and bundling TypeScript projects within the monorepo. See the scripts folder for existing build and bundling scripts.

### CI/CD

- GitHub Actions MUST be used for continuous integration and continuous deployment (CI/CD) pipelines.
- Dockerfiles MUST be created for each application to ensure consistent deployment strategies across different environments.

### Languages and Frameworks

- TypeScript SHOULD be used as the primary programming language in the codebase.
    - Raw JavaScript SHALL NOT be used. Ever
- Node.js SHOULD be used as the runtime environment for server-side code.
- ESLint MUST be used for linting the codebase, following the rules defined in the root of the monorepo.
- Zod SHOULD be used for schema validation and type inference.
- Jest SHOULD be used for unit testing the codebase.

## Architecture Standards

- The code MUST follow a modular architecture, with each module encapsulating a specific functionality or feature.
    - Each file MUST contain a single responsibility, meaning that each file should only contain code related to a single concept or functionality.
- Packages MUST have at least one tag defined in their package.json file

### Application and Package Tags

- A package MAY have multiple tags
- A package MUST have at least one tag
- A package MUST NOT have duplicate tags
- Tags MAY be one of the following:
    - `ui`: A user interface package
    - `server`: A server-side package
    - `client`: A client-side package
    - `util`: A utility package
    - `query`: A query (read only functionality) package
    - `command` : A command (create, update, and delete functionality) package
    - `model`: A data model/contract package
    - `domain`: A business domain package
- Tags MUST follow the following restrictions:
    - A package with the `ui` tag MUST NOT have the `server` tag
    - A package with the `server` tag MUST NOT have the `ui` or `client` tag
    - A package with the `query` tag MUST only depend on packages with the `model`, `util`, or other `query` tags

## Look and Feel Requirements

- Typescript MUST use ES module importing and exporting
    - Imports MUST use relative paths from the src directory
- Prettier MUST be used for code formatting, following the configuration defined in the root of the monorepo.
- Code MUST adhere to the ESLint rules defined in the root of the monorepo
- Interfaces, types, and zod schemas MUST be placed in a file named similarly to `*.schema.ts`
    - Each interface, type, and zod schema MUST be exported from the module
- Services and utility functions related to filters MUST be placed in a file named similarly to `*.service.ts` or `*.util.ts`
    - Each service and utility function MUST be exported from the module
- Each folder MUST contain an `index.ts` file that exports all public classes, interfaces, types, functions, and constants from that folder.

### AI Generated Code

- AI generated code MUST be prefixed with a comment
- AI generated code that has been reviewed and SHOULD have the comment removed in its entirety to ensure credibility of authorship when viewing git history
- The comment MUST include the name of the AI model used and the prompt template title.
- The comment MUST be placed at the top of each generated block. A block of code can be defined as a function, a class, or an entire file
- The AI generated code comment MUST follow the format below:

```ts
// AI Generated ({model used})
// Prompt Template: {prompt template title}
code here...
```
