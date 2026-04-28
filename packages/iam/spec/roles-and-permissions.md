# Roles and Permissions

## Roles

Roles are a collection of permissions that define a set of access rights within the system. They are assigned to Principles through Policies to grant them specific capabilities. Roles help to simplify access management by grouping related permissions together, allowing for easier assignment and maintenance of access rights.

### Roles Naming Conventions

`req-iam.roles.naming-convention-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

Roles SHOULD follow the naming convention of `service.role-name` or `service.resource.role-name`. At the very least, the role name should be self explanatory at a glance (does not need a long description)

Where:

- `service` is the name of the service that owns the role (e.g., `iam`, `restaurant-catalog`, `file-storage`).
- `resource` (optional) is the type of resource being accessed (e.g., `principle`, `menu`, `file`)
- `role-name` is a descriptive name for the role that indicates its purpose or level of access (e.g., `admin`, `editor`, `viewer`).
    - Default role names SHOULD use the following suffixes to indicate the level of access:
        - `admin`: Full access to all resources and actions within the service.
        - `editor`: Access to create, read, update, and delete resources, but not manage permissions or roles.
        - `viewer`: Read-only access to resources.

### Organizational Admin Roles

`req-iam.roles.org-admin-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

Special roles MAY exist that are reserved for IT organization administrators. These roles exist to manage access to internal resources that should otherwise never be managed by regular users.

For example:

A user with the `iam.editor` role may have the `iam.roles.delete` permission, but they should not be able to delete the `iam.admin` role. This is because the `iam.admin` role is a special role that is reserved for IT organization administrators, and it should not be managed by regular users. In contrast, a user with the `iam.editor` role should be able to delete a role with less privileges (i.e. a read-only role such as `restaurant-catalog.viewer`) or one created by another user with the `iam.editor` (i.e. `restaurant-catalog.tags.editor`).

### Service Admin Roles

`req-iam.roles.service-admin-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

All services MUST come with a default admin role that has full access to all resources and actions within the service.

Rationale:

This is to ensure that there is always a role available that can be assigned to principles to grant them full access to the service, which is necessary for managing the service and its resources effectively.

### Child Roles

`req-iam.roles.role-hierarchy-1`

A role MAY have parent roles. Children of a parent role inherit all permissions of the parent role, in addition to any permissions they have directly assigned to them. A role can have multiple parent roles, and there is no limit to the depth of the role hierarchy.

Rationale:

This allows for more flexible and efficient management of permissions. For example, if there is a role that has a set of permissions that are common to multiple other roles, it can be defined as a parent role, and the child roles can inherit those permissions without needing to duplicate them.

## Permissions

Permissions are the fundamental building blocks of our access control system. They represent specific actions that can be performed on resources within the system. Permissions are assigned to roles, which are then assigned to principles (users or service accounts) to grant them the necessary access rights.

### Permissions Naming Convention

`req-iam.permissions.naming-convention-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

A permissions name MUST take a form similar to the following: `service.resource.verb`

Where:

- `service` is the name of the service that owns the resource (e.g., `iam`, `restaurant-catalog`, `file-storage`).
- `resource` is the type of resource being accessed (e.g., `principle`, `menu`, `file`).
- `verb` is the action being performed on the resource (e.g., `create`, `read`, `update`, `delete`).

Verb operations MAY take on any form. The default convention for CRUD operations is as follows:

- `create`: Permission to create a new resource.
    - Example: `iam.roles.create` allows a principle to create new roles within the IAM service.
- `read`: Permission to read or view a resource.
    - Example: `iam.roles.read` allows a principle to view existing roles within the IAM service.
- `update`: Permission to modify an existing resource.
    - Example: `iam.roles.update` allows a principle to modify existing roles within the IAM service.
- `delete`: Permission to remove a resource.
    - Example: `iam.roles.delete` allows a principle to delete existing roles within the IAM service.

Rationale:

This naming convention provides a clear and consistent structure for permissions, making it easier to understand the context, purpose, and scope of each permission at a glance.

### Permission To Principle Assignment

`req-iam.permissions.assignment-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

Permissions MUST NOT be assigned directly to principles. Instead, permissions MUST be grouped into roles, and roles MUST be assigned to principles through policies.

Rationale:

The scope of a permission is too broad until it is related to a Policy. This is because services can be shared between organizational units (i.e. two different customers using file storage). Viewing a Permission alongside Policies provides enough context to understand exactly what permissions a Principle should have in an organizational unit. A Principle with admin access to a service in one organizational unit does not imply they should also have admin access in another organizational unit.

## Application IAM Metadata

`req-iam.metadata.model-1`

![status](https://img.shields.io/badge/status-draft-red)

If an application is to exist in the IAM system, it MAY define language agnostic (json preferred) service, role, and permission metadata for the IAM service to consume. Services MAY use this metadata to reference a services default roles and permissions statically within the application codebase, while still allowing the IAM service to consume and manage them externally.

The file MUST be named `iam-metadata.json` and placed in the root of the application codebase. The file MUST follow the following structure:

```json
{
    "serviceName": "string",
    "roles": [
        {
            "name": "string",
            "parentRoles": ["string"],
            "permissions": ["string"]
        }
    ]
}
```

For example, a restaurant catalog service may define the following metadata:

```json
{
    "serviceName": "restaurant-catalog",
    "roles": [
        {
            "name": "editor",
            "parentRoles": ["viewer"],
            "permissions": ["restaurant-catalog.menu-items.create", "restaurant-catalog.menu-items.update", "restaurant-catalog.menu-items.delete", "restaurant-catalog.tags.create", "restaurant-catalog.tags.update", "restaurant-catalog.tags.delete", "restaurant-catalog.sizes.create", "restaurant-catalog.sizes.update", "restaurant-catalog.sizes.delete"]
        },
        {
            "name": "viewer",
            "permissions": ["restaurant-catalog.menu-items.read", "restaurant-catalog.tags.read", "restaurant-catalog.sizes.read"]
        }
    ]
}
```

Rationale:

This is to enable the application code to reference the permissions and roles it defines statically, while still providing a format that allows external services (i.e. the IAM service itself) to easily consume them

A network control plane or API gateway integrated into the IAM service could also use this metadata to enforce access control at the network's edge, without needing applications to be aware of what roles and permissions are necessary to access an exposed resource. Future goals
