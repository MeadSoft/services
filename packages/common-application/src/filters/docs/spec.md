# Query Filtering Model and Service Specification

## Codebase Requirements

- The filtering service must be implemented as a standalone module within the `common-application` package.

## Models

### Queries

### Columns

### Filters

- Each `filter` MUST have a unique identifier property.
- Each `filter` MUST have an operator property that defines what affect the filter has on the query.
    - The operation MUST be one of the unary or binary operations defined below.
- Each `filter` MUST have a value property that defines the value to be used in the filter condition. Unary filters MUST have exactly one value property, while binary filters MUST have exactly two value properties.
    - The value MAY be a direct value (e.g., string, number, boolean, datetime, null)
    - The value MAY be a reference to a `column`
    - The value MAY be a reference to a `query`
    - The value MAY be a raw string expression that is intended to be properly interpreted by the underlying database engine.

## Technical Requirements

- Filter objects and interfaces MUST be written in TypeScript.
- Filter objects and interfaces MUST be properly typed using TypeScript's type system.
- Filter objects and interfaces MUST contain only properties
- Filter objects and interfaces MUST NOT contain any methods or functions.
- There MUST exist a zod schema for each filter object and interface defined in this specification.

### Unary Operations

A unary operation is an operation with only one operand. The following unary operations MUST be supported:

- **Exists**: The query should return a value if it exists.
- **Not Exists**: The query should return a value if it does not exist.
- **Is Null**: The query should return a value if it is null.
- **Is Not Null**: The query should return a value if it is not null.
- **Not**: The query should negate the result of the filter condition.

### Binary Operations

- **Equals**: The query should return a value equal to the specified value.
- **Not Equals**: The query should return a value not equal to the specified value.
- **Less Than**: The query should return a value less than the specified value.
- **Less Than or Equal To**: The query should return a value less than or equal to the specified value.
- **Greater Than**: The query should return a value greater than the specified value.
- **Greater Than or Equal To**: The query should return a value greater than or equal to the specified value.
- **In**: The query should return a value that exists within the specified set of values. The specified set of values may be another query
- **Not In**: The query should return a value that does not exist within the specified set of values.
- **Between**: The query should return a value within the specified range.
- **Not Between**: The query should return a value outside the specified range.
- **Like**: The query should return a value that matches the specified pattern.
- **Like Insensitive**: The query should return a value that matches the specified pattern, case-insensitively.
- **Not Like Insensitive**: The query should return a value that does not match the specified pattern, case-insensitively.

### Supported Filter To Filter Operations

- And
- Or

## Look and Feel Requirements

import { IColumn } from './column.schema';

export type FilterOperator =
// eslint-disable-next-line @typescript-eslint/sort-type-constituents
| 'eq'
| 'ne'
| 'lt'
| 'lte'
| 'gt'
| 'gte'
| 'in'
| 'notIn'
| 'exists'
| 'notExists'
| 'isNull'
| 'isNotNull'
| 'between'
| 'notBetween'
| 'like'
| 'likeInsensitive'
| 'notLikeInsensitive'
| 'not';

/\*\*

- Represents a filter condition for querying data.
-
- The `value` can either be a direct value or an `IColumn` reference,
- allowing for comparisons between columns.
  \*/
  export interface IFilter<
  TValue extends IColumn | string = string,
    > extends IColumn {
                                                                                                              operator: FilterOperator;
                                                                                                              value: TValue;
    }
