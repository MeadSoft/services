import { IFieldMetadata } from './field-metadata.schema';

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

/**
 * Represents a filter condition for querying data.
 *
 * The `value` can either be a direct value or an `IFieldMetadata` reference,
 * allowing for comparisons between fields.
 */
export interface IFilter<
    TValue extends IFieldMetadata | string = string,
> extends IFieldMetadata {
    operator: FilterOperator;
    value: TValue;
}
