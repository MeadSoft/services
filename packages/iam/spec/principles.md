# Principles

A Principle is an entity that can be authenticated and authorized to access resources within the system. Principles can represent users, groups, or service accounts. They are assigned roles through policies, which grant them specific permissions to perform actions on organizational resources.

## Principle Login Methods

`requirement-iam.principle.login-methods-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

A principle MUST have at least one login method associated with it to be able to authenticate and access the system. A principle SHOULD NOT exist or be created without any login methods
