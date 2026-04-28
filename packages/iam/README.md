# IAM Service

- [Roles and Permissions](./spec/roles-and-permissions.md)

![Identity & Access Management ERD](./Identity%20&%20Access%20Management%20ERD.svg)

## Glossary

- **Principle**: An individual user, service account, or system entity who can authenticate and interact with the system.
- **Role**: A collection of permissions that can be assigned to a principle. Roles define what actions a principle can perform within the system.
- **Permission**: A specific action or set of actions that can be performed on a resource (e.g., read, write, delete). Permissions are assigned to roles to control access to resources.
- **Resource**: An entity within the system that can be accessed or manipulated through a service, such as a database, API endpoint, or file. Resources are protected by permissions to ensure that only authorized principles can interact with them.
- **Service**: A component or module within the system that provides specific functionality, such as user management, authentication, or data processing. Services interact with resources and enforce access control based on roles and permissions.
- **Authentication**: The process of verifying the identity of a principle, typically through credentials such as a username and password, API key, or token.
- **Authorization**: The process of determining whether an authenticated principle has the necessary permissions to perform a specific action on a resource.
