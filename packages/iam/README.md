# IAM Service

![Identity & Access Management ERD](./Identity%20&%20Access%20Management%20ERD.svg)

## Roles

Roles are a collection of permissions that define a set of access rights within the system. They are assigned to Principles through Policies to grant them specific capabilities. Roles help to simplify access management by grouping related permissions together, allowing for easier assignment and maintenance of access rights.

## Permissions

Permissions are the fundamental building blocks of our access control system. They represent specific actions that can be performed on resources within the system. Permissions are assigned to roles, which are then assigned to principles (users or service accounts) to grant them the necessary access rights.

### Naming Convention

`req-iam.permissions.naming-convention-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

A permissions name MUST take a form similar to the following: `service.resource.verb`

Where:

- `service` is the name of the service that owns the resource (e.g., `iam`, `restaurant-catalog`, `file-storage`).
- `resource` is the type of resource being accessed (e.g., `principle`, `menu`, `file`).
- `verb` is the action being performed on the resource (e.g., `create`, `read`, `update`, `delete`).

Rationale:

This naming convention provides a clear and consistent structure for permissions, making it easier to understand the context, purpose, and scope of each permission at a glance.

### Permission To Principle Assignment

`req-iam.permissions.assignment-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

Permissions MUST NOT be assigned directly to principles. Instead, permissions MUST be grouped into roles, and roles MUST be assigned to principles through policies.

Rationale:

The scope of a permission is too broad until it is related to a Policy. This is because services can be shared between organizational units (i.e. two different customers using file storage). Viewing a Permission alongside Policies provides enough context to understand exactly what permissions a Principle should have in an organizational unit. A Principle with admin access to a service in one organizational unit does not imply they should also have admin access in another organizational unit.

## Glossary

- **Principle**: An individual user, service account, or system entity who can authenticate and interact with the system.
- **Role**: A collection of permissions that can be assigned to a principle. Roles define what actions a principle can perform within the system.
- **Permission**: A specific action or set of actions that can be performed on a resource (e.g., read, write, delete). Permissions are assigned to roles to control access to resources.
- **Resource**: An entity within the system that can be accessed or manipulated through a service, such as a database, API endpoint, or file. Resources are protected by permissions to ensure that only authorized principles can interact with them.
- **Service**: A component or module within the system that provides specific functionality, such as user management, authentication, or data processing. Services interact with resources and enforce access control based on roles and permissions.
- **Authentication**: The process of verifying the identity of a principle, typically through credentials such as a username and password, API key, or token.
- **Authorization**: The process of determining whether an authenticated principle has the necessary permissions to perform a specific action on a resource.
