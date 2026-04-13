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

/**
 * Represents a filter condition for querying data.
 *
 * The `value` can either be a direct value or an `IColumn` reference,
 * allowing for comparisons between columns.
 */
export interface IFilter<
    TValue extends IColumn | string = string,
> extends IColumn {
    operator: FilterOperator;
    value: TValue;
}
