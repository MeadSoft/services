# Data Model Architecture

## Primary Keys

`architecture-data-model.primary-keys.uuid-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

The default standard for all data models primary keys data type MUST be an implementation of [Universally Unique Identifiers (UUIDs)](https://www.rfc-editor.org/rfc/rfc9562.html)

Rationale:

Using UUIDs in distributed systems as primary keys provides several advantages, including global uniqueness across distributed systems, reduced risk of collisions, and improved scalability.

## UUID Version

`architecture-data-model.uuid.version-1`

![status](https://img.shields.io/badge/status-reviewed-brightgreen)

All [Universally Unique Identifiers (UUIDs)](https://www.rfc-editor.org/rfc/rfc9562.html) MUST be, at least, an implementation of UUID version 7 (UUIDv7)

Rationale:

UUID identifiers provide the least pain for developers and the most flexibility for future architectural changes in distributed systems. To ensure indexing remains efficient in databases when using UUIDs, we require the use of UUID version 7 (UUIDv7) strings. UUIDv7 is a time-ordered UUID format that combines a timestamp with random bits, allowing for monochronological (time‑ordered) index hashing that will help with paging optimization in B-tree indexes.
