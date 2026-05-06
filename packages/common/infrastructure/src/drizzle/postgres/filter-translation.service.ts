import { Injectable } from '@nestjs/common';
import {
    and,
    Column,
    eq,
    gt,
    gte,
    like,
    lt,
    lte,
    ne,
    SQL,
    sql,
    Table,
} from 'drizzle-orm';
import { IFilterTranslationService } from '../../contracts/filter-translation.schema';
import {
    EMPTY_LENGTH,
    FIRST_INDEX,
    IFilter,
    NOT_FOUND_INDEX,
} from '@meadsoft/common';
import { Err, Ok, Result } from 'ts-results';

const SINGLE_LENGTH = 1;
const BETWEEN_PARTS = 2;

@Injectable()
export class DrizzlePgFilterTranslationService implements IFilterTranslationService<
    SQL,
    Table
> {
    /**
     * Translates the contract-level filters into database SQL conditions.
     *
     * If tables are provided, it will attempt to find the matching column definitions
     * for the filter fields and use those to ensure the SQL is correctly formed.
     *
     * If tables are provided and a filter references a resource or field that cannot
     * be found in the tables, it will return an error indicating the missing reference.
     *
     * If no tables are provided, it will generate SQL using the resource and field names
     * directly, which may be useful for simple cases or when the caller has its own way
     * of handling table/column references.
     *
     * @param filters The array of filters to translate
     * @param tables Optional array of table definitions to assist with column reference resolution
     * @returns A Result containing the translated SQL condition or an error if translation failed
     *
     * ---
     *
     * @example A single filter
     *
     * ```ts
     * const filters: IFilter[] = [
     *     { resource: 'principles', field: 'email', operator: 'eq', value: 'test@example.com' }
     * ];
     * const sql = filterTranslationService.translate(filters, [principlesTable]);
     * ```
     *
     * ---
     *
     * @example Multiple filters
     *
     * ```ts
     * const filters: IFilter[] = [
     *     { resource: 'principles', field: 'id', operator: 'eq', value: '123' },
     *     { resource: 'principleLoginMethods', field: 'providerEmail', operator: 'eq', value: 'test@example.com' }
     * ];
     * const sql = filterTranslationService.translate(filters, [principlesTable, principleLoginMethodsTable]);
     * ```
     *
     * ---
     *
     * @example A filter without a matching table reference
     *
     * ```ts
     * const filters: IFilter[] = [
     *    { resource: 'unknownResource', field: 'email', operator: 'eq', value: 'test@example.com' }
     * ];
     * // will not throw an error
     * const sql = filterTranslationService.translate(filters);
     * // will throw an error!
     * const sql = filterTranslationService.translate(filters, [principlesTable]);
     * ```
     *
     */
    translate(
        filters: IFilter[],
        tables?: Table[],
    ): Result<SQL | undefined, Error> {
        if (filters.length === EMPTY_LENGTH) {
            return Ok(undefined);
        }
        const conditionResults = filters.map((filter) =>
            this.translateOne(filter, tables),
        );
        const errorIndex = conditionResults.findIndex(
            (condition) => condition.err,
        );
        if (errorIndex !== NOT_FOUND_INDEX) {
            const error = conditionResults[errorIndex];
            return error;
        }
        const conditions: SQL[] = conditionResults.map((result) =>
            result.unwrap(),
        );
        if (conditions.length === SINGLE_LENGTH) {
            return Ok(conditions[FIRST_INDEX]);
        }
        return Ok(and(...conditions));
    }

    private getColumnReference(
        field: IFilter,
        tables?: Table[],
    ): Result<SQL, Error> {
        if (tables === undefined || tables.length === EMPTY_LENGTH) {
            return Ok(sql`${field.resource}.${field.field}`);
        }
        const firstMatchingTable = tables.find(
            (table) => table._.name === field.resource,
        );
        if (firstMatchingTable === undefined) {
            return Err(
                new Error(`No table found for resource: ${field.resource}`),
            );
        }
        const matchingColumn: Column | undefined =
            firstMatchingTable._.columns[field.field];
        if (matchingColumn === undefined) {
            return Err(
                new Error(
                    `No column found for field: ${field.field} in table: ${field.resource}`,
                ),
            );
        }
        return Ok(matchingColumn.getSQL());
    }

    private translateOne(
        filter: IFilter,
        tables?: Table[],
    ): Result<SQL, Error> {
        const column = this.getColumnReference(filter, tables);
        if (column.err) {
            return Err(column.val);
        }

        switch (filter.operator) {
            case 'eq':
                return Ok(eq(column.val, filter.value));
            case 'ne':
                return Ok(ne(column.val, filter.value));
            case 'lt':
                return Ok(lt(column.val, filter.value));
            case 'lte':
                return Ok(lte(column.val, filter.value));
            case 'gt':
                return Ok(gt(column.val, filter.value));
            case 'gte':
                return Ok(gte(column.val, filter.value));
            case 'like':
                return Ok(like(column.val, filter.value));
            case 'likeInsensitive':
                return Ok(sql`${column.val} ILIKE ${filter.value}`);
            case 'notLikeInsensitive':
                return Ok(sql`${column.val} NOT ILIKE ${filter.value}`);
            case 'isNull':
                return Ok(sql`${column.val} IS NULL`);
            case 'isNotNull':
                return Ok(sql`${column.val} IS NOT NULL`);
            case 'in':
                return Ok(
                    sql`${column.val} IN (${sql.raw(this.toParamList(filter.value))})`,
                );
            case 'notIn':
                return Ok(
                    sql`${column.val} NOT IN (${sql.raw(this.toParamList(filter.value))})`,
                );
            case 'between':
                return Ok(
                    this.translateBetween(
                        sql`${column.val}`,
                        filter.value,
                        false,
                    ),
                );
            case 'notBetween':
                return Ok(
                    this.translateBetween(
                        sql`${column.val}`,
                        filter.value,
                        true,
                    ),
                );
            case 'not':
                return Ok(sql`NOT (${column.val} = ${filter.value})`);
            case 'exists':
                return Ok(sql`EXISTS (${sql.raw(filter.value)})`);
            case 'notExists':
                return Ok(sql`NOT EXISTS (${sql.raw(filter.value)})`);
            default:
                return Err(
                    new Error(
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `Unsupported filter operator: ${filter.operator satisfies never}`,
                    ),
                );
        }
    }

    private translateBetween(column: SQL, value: string, negate: boolean): SQL {
        const parts = value.split(',');
        if (parts.length !== BETWEEN_PARTS) {
            throw new Error(
                `between/notBetween requires a comma-separated pair, got: ${value}`,
            );
        }
        const [lower, upper] = parts;
        const keyword = negate ? sql`NOT BETWEEN` : sql`BETWEEN`;
        return sql`${column} ${keyword} ${lower.trim()} AND ${upper.trim()}`;
    }

    private toParamList(value: string): string {
        return value
            .split(',')
            .map((v) => this.escapeValue(v.trim()))
            .join(', ');
    }

    private escapeValue(value: string): string {
        return `'${value.replace(/'/g, "''")}'`;
    }
}
