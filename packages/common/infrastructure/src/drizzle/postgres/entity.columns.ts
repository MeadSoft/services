import { Column, ColumnBaseConfig, Table, TableConfig } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';
import { changeHistoryColumns } from './change-history.columns';
import { IContractToRepository } from '../../contracts';

export const id = () => uuid('id').notNull().primaryKey();

export const entityColumns = {
    id: id(),
    ...changeHistoryColumns,
};

export type TableConfigWithEntityColumns = TableConfig & {
    columns: {
        id: Column<
            ColumnBaseConfig<
                typeof entityColumns.id._.dataType,
                typeof entityColumns.id._.columnType
            >
        >;
        createdById: Column<
            ColumnBaseConfig<
                typeof entityColumns.createdById._.dataType,
                typeof entityColumns.createdById._.columnType
            >
        >;
        createdDate: Column<
            ColumnBaseConfig<
                typeof entityColumns.createdDate._.dataType,
                typeof entityColumns.createdDate._.columnType
            >
        >;
        updatedById: Column<
            ColumnBaseConfig<
                typeof entityColumns.updatedById._.dataType,
                typeof entityColumns.updatedById._.columnType
            >
        >;
        updatedDate: Column<
            ColumnBaseConfig<
                typeof entityColumns.updatedDate._.dataType,
                typeof entityColumns.updatedDate._.columnType
            >
        >;
    };
};
export type TableWithEntityColumns = Table<TableConfigWithEntityColumns>;

export function createEntityToRepositoryMapping(
    serviceName: string,
    resourceName: string,
    table: TableWithEntityColumns,
): IContractToRepository<Column>[] {
    return [
        {
            service: serviceName,
            resource: resourceName,
            field: table._.columns.id._.name,
            column: table._.columns.id,
        },
        {
            service: serviceName,
            resource: resourceName,
            field: table._.columns.createdById._.name,
            column: table._.columns.createdById,
        },
        {
            service: serviceName,
            resource: resourceName,
            field: table._.columns.createdDate._.name,
            column: table._.columns.createdDate,
        },
        {
            service: serviceName,
            resource: resourceName,
            field: table._.columns.updatedById._.name,
            column: table._.columns.updatedById,
        },
        {
            service: serviceName,
            resource: resourceName,
            field: table._.columns.updatedDate._.name,
            column: table._.columns.updatedDate,
        },
    ];
}
