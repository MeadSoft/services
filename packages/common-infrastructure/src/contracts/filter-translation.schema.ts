import { IFilter } from '@meadsoft/common';

export interface IFilterTranslationService<TFilterImpl = unknown> {
    translate(...filters: IFilter[]): TFilterImpl[];
}
