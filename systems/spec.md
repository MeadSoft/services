# Systems

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

A system is a collection of applications that work together to provide a broader set of functionalities or services. Each system has its own dedicated folder within the `systems/` directory (i.e., `/systems/{system-name}/`).

## Directory Structure Requirements

> TODO: research how terraform, tekton, or kubernetes configs can be used here in addition to compose files. Docker is not intended to reflect dependencies on external systems, so it fails to provide a complete picture of the system architecture outside of defining a local development environment.

- A `compose.yaml` SHOULD exist for deployment of the system locally via Docker Compose or Docker Swarm
