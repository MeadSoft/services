# Packages

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

A package is a reusable library or module that encapsulates specific functionality or features. Each package has its own dedicated folder within the `packages/` directory (i.e., `/packages/{package-name}/`).

## Directory Structure Requirements

- `src/`
    - MUST exist
    - MUST contain production source code
- `examples/`
    - MAY exist
    - MUST not contain production source code
    - This folder is intended to provide examples of how to use the package
- `tests/`
    - MAY exist
    - SHOULD only contain all unit and acceptance tests
- `package.json`
    - MUST exist
    - MUST contain the package's dependencies
- `tsconfig.json`
    - MAY exist
    - MUST contain TypeScript configuration specific to the package
