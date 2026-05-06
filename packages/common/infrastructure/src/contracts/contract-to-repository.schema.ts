export interface IContractToRepository<IColumn = unknown> {
    service: string;
    resource: string;
    field: string;
    column: IColumn;
}
