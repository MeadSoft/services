# Applications

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

**Application**: An application in the context of this codebase is executable, deployable code that is intended to represent at least one deployed instance of service(s)

Each application has its own dedicated folder within the `apps/` directory (i.e., `/apps/{app-name}/`).

## Technical Requirements

- **Applications** SHOULD NOT depend on other applications directly. This is to prevent service level objectives (SLOs) from being coupled together.
    - For example, if Application A has a service-level agreement of 250ms and Application B depends on Application A, then Application B's SLO is now also _at least_ 250ms. This coupling can lead to cascading failures and makes it difficult to manage applications in a distributed system.
- **Applications** MAY depend on packages
    - Packages aim to provide reusable functionality that can be shared across multiple applications without coupling their SLOs.

### Known Concerns

Applications sometimes MUST depend on another application. In such cases, it is crucial that the dependency has a well-defined, stable API contract and an efficient runtime to minimize the risk of cascading failures.

Examples of such applications include, but are not limited to:

- A database
- An authentication service
- A caching service
- A messaging broker
- A service discovery service
    - also consider using API gateways or service meshes to manage inter-service communication

When an application depends on another application, it is recommended to implement resilience patterns such as circuit breakers, retries, and timeouts to mitigate the impact of potential failures in the dependent application.

## Directory Structure Requirements

- `src/`
    - MUST exist
    - MUST contain all production code
- `scripts/`
    - MAY exist
    - MUST NOT contain production code
    - MAY contain scripts for auxiliary tasks (e.g., custom deployments, data seeding, configuration helpers)
- `tests/`
    - MAY exist
    - MUST NOT contain production code
    - MAY contain all types of testing (i.e., unit, integration, acceptance, etc.)
- `.env.{env}`
    - MAY exist
    - MUST contain secret config values
    - MUST NOT be committed to version control
- `config.{env}.json`
    - MAY exist
    - MUST contain non-secret config values
    - MAY be committed to version control
- `Containerfile`
    - MUST exist
    - MUST contain the deployment configuration of the application for **any** environment
- `package.json`
    - MUST exist
    - MUST contain the application's dependencies
    - MUST contain scripts commonly used alongside the application (i.e., start, build, test, configure, seed)
- `tsconfig.json`
    - MAY exist
    - MUST contain the TypeScript configuration that is specific to the application
